# 基于Sourcemap的nestjs源码调试

用于Sourcemap的源码调试, 可以使用 `git pull` 拉取最新代码

## 修改编译配置生成对应的Sourcemap

```js
// packages/tsconfig.build.json
{
  "sourceMap": true, // 生成 sourcemap
}
```

此时生成的Sourcemap内容内，文件的地址是相对地址，无法定位到nestjs的原始代码，需要在每个包内的 `tsconfig.build.json` 配置内设置路径：

```js
{
  "compilerOptions": {
    // 设置为当前包的绝对路径地址，debug是可以找到源码
    "sourceRoot": "/Users/huazi/referCode/A-debug-nest-master/packages/core",
    ...
  },
}
```

此时Sourcemap内文件地址变为当前电脑内的绝对路径地址。

- 配置前路径：``
- 配置后路径：`/Users/huazi/referCode/A-debug-nest-master/packages/core`

执行 `npm run build` 命令，即可生成编译并生成Sourcemap

上述的编译命令完成后，会执行 `postbuild` 脚本，把编译后的代码放在 `node_modules/@nestjs` 下

## 复制 dist 文件到项目 node_modules 内

把上述打包后的 `node_modules/@nestjs` 文件复制到项目内的 node_modules 内，则在调试时可以直接定位到项目原始代码。

## 创建调试配置，进行调试

在 debug 下创建调试配置：

```json
{
      "name": "Launch via NPM",
      "request": "launch",
      "runtimeArgs": [
        "run-script",
        "start"
      ],
      "runtimeExecutable": "npm",
      "console": "integratedTerminal",
      // 这里需要添加下，用于解析Sourcemap地址
      "resolveSourceMapLocations": [
        "${workspaceFolder}/**"
      ],
      "cwd": "${workspaceFolder}",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
```