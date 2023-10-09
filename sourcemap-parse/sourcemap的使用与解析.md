# sourcemap的使用与解析

在前端开发过程中，JavaScript、CSS 和其他文件通常会被压缩和混淆，以减小文件大小和提高网站加载速度。然而，这会让调试和错误定位变得困难，因为生产环境中的代码难以阅读和理解。

Sourcemap（源代码映射）用于将生产环境中的压缩代码映射回原始的源代码。

## Sourcemap 生产类型

在 webpack中，Sourcemap的生成可以使用如下方式的组合：

|关键字|含义|特点|
|:----:|:----:|:----:|
|source-map|产生.map 文件|定位信息最全，但也.map 文件最大，效率最低|
|eval|使用 eval 包裹模块代码|利用字符串可缓存从而提效|
|cheap|不包含列信息， 也不包含 loader 的 sourcemap|错误信息只会定义到行，而不会定义到列, 精准度降低换取文件内容的缩小|
|module|包含 loader 的 sourcemap,否则无法定义源文件|会保留 loader 处理前后的文件信息映射,解决无法定位到 loader 处理前的源代码问题|
|inline|将.map 作为 DataURI 嵌入，不单独生成.map 文件|不单独生成.map 文件, 减少文件数|

## Sourcemap 具体字段含义

|字段|含义|
|:----:|:----:|
|version|Source map 的版本，目前为 3|
|file|转换后的文件名|
|sourceRoot|转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空|
|sources|转换前的文件,该项是一个数组,表示可能存在多个文件合并|
|names|转换前的所有变量名和属性名|
|mappings|记录位置信息的字符串|

## SourceMap 的具体使用方式

### 开发环境

我们在开发环境对 sourceMap 的要求是：快（eval），信息全（module），且由于此时代码未压缩，我们并不那么在意代码列信息(cheap),

所以开发环境比较推荐配置：`devtool: cheap-module-eval-source-map`

### 生产环境

一般情况下，我们并不希望任何人都可以在浏览器直接看到我们未编译的源码，

所以我们不应该直接提供 sourceMap 给浏览器。但我们又需要 sourceMap 来定位我们的错误信息，

一方面 webpack 会生成 sourcemap 文件以提供给错误收集工具比如 sentry，另一方面又不会为 bundle 添加引用注释，以避免浏览器使用。

这时我们可以设置: `devtool: hidden-source-map`

### 浏览器Sourcemap的关联

在webpack或者vite等工具打包后，生产的压缩后的文件通常还包含一个注释，指向对应的 sourcemap 文件

`//# sourceMappingURL=main.min.js.map`

当浏览器的开发者工具检测到这个注释时，它会自动加载 sourcemap 文件，并在调试时显示原始的未压缩代码。

这样，当你在浏览器的开发者工具中设置断点、查看堆栈跟踪或查看日志时，你将看到原始的、易于阅读的代码，而不是压缩后的代码。

### 自主解析Sourcemap并定位代码位置

如上面所述， 在生产模式下，不会把 `sourcemap` 上传到服务内，此时在报错排查时，就需要自主解析 `sourcemap` 文件并定位原始代码位置。

如编译后的文件报错如下：

```text
index-47f85c64.js:1 ReferenceError: a is not defined
    at ru (index-47f85c64.js:5:22938)
    at n (index-47f85c64.js:5:23048)
    at Ye (index-47f85c64.js:1:12663)
    at Re (index-47f85c64.js:1:12741)
    at HTMLButtonElement.n (index-47f85c64.js:1:49626)
```

此时就可以对相应的 `sourcemap` 文件 `index-47f85c64.js.map` 进行解析，定位原始代码位置：

可以使用 `source-map`库进行 `sourcemap` 文件的解析操作。

```js
// 库的方式使用
import { SourceMapConsumer }  from 'source-map'

await SourceMapConsumer.with(rawSourceMap, null, consumer => {
  
  // 传入编译后的报错行列号，解析出原始文件信息，包括（原始文件名，原始代码行，原始代码列）
  const sourceInfo = consumer.originalPositionFor({
    line: 1,
    column: 9744
  })

  console.log('infos ===>>', sourceInfo);

  // 传入原始代码文件名，可以获取原始代码
  const content = consumer.sourceContentFor(sourceInfo.source)
  console.log('---->>>>', content);
});
```

> 需要注意的是：如果需要在浏览器内使用此库，需要引入对应的wasm文件库进行支持

```html
<script src="https://unpkg.com/source-map@0.7.3/dist/source-map.js"></script>
<script>
    sourceMap.SourceMapConsumer.initialize({
        "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
    });
</script>
```

### 拓展思考

在公司内部一般都会有相应的日志监控系统进行错误收集，所以除了手动解析对应的map文件外，可以从工程化层面进行错误信息的自动关联：

- 开发 webpack 或者 vite 相应的插件，在生产环境打包时，针对 `sourcemap` 文件进行处理并上传
  - 插件内配置项目信息，用于Sourcemap上传后的项目关联
  - 插件内配置版本信息，项目错误上报也应配置版本信息，用于map的关联
- 日志监控系统内接口上传的Sourcemap文件进行存储
- 用户查看错误日志时，进行Sourcemap的关联，并展示原始代码信息

注：对于错误堆栈的解析，可以使用 `error-stack-parser` 这个库进行解析
