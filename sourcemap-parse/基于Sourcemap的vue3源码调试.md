# 基于Sourcemap的vue3源码调试

用于Sourcemap的源码调试, 可以使用 `git pull` 拉取vue3最新代码, 使用 `pnpm install` 安装依赖，使用 `pnpm build`进行编译

由于不需要单元测试相关，可以把 `package.json` 内的 `puppeteer` 依赖删除掉

## 修改编译配置生成对应的Sourcemap

```js
// rollup.config.js 内设置为 true
output.sourcemap = !!process.env.SOURCE_MAP
```

此时生成的Sourcemap内容内，文件的地址是相对地址，无法定位到vue的原始代码，可以在上述配置下，再添加如下代码：

```js
// sourcemapPath 就是 sourcemap 的绝对路径
// relativeSourcePath 是 sourcemap 的路径到源码路径的相对路径
output.sourcemapPathTransform = (relativeSourcePath, sourcemapPath) => {
  const newSourcePath = path.join(path.dirname(sourcemapPath), relativeSourcePath);
  return newSourcePath;
}
```

此时Sourcemap内文件地址变为当前电脑内的绝对路径地址。

- 配置前路径：`../src/dev.ts`
- 配置后路径：`/Users/huazi/Workspace/A-vue-core-main/packages/vue/src/dev.ts`

## 复制 dist 文件到项目 node_modules 内

把上述打包后的 dist 文件复制到项目内的 node_modules 内，则在调试时可以直接定位到项目原始代码。

根据需要，需要替换的包名为：`@vue 下的各类包dist`、`vue 下的 dist`

值得注意的是，如果是 `vite`项目，需要在配置内排除下预加载，要不然路径就变了，是找不到原始代码文件的：

```js
optimizeDeps: {
  exclude: ['vue'],
},
```