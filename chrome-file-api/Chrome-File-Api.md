# 浏览器文件系统 API

最新 Chrome 浏览器可以在用户主动触发下，基于 `FileSystemHandle` API进行文件的读取和修改操作。

注意：此类API只能在 https 下才可支持

兼容性情况参看：[can i use](https://caniuse.com/?search=FileSystemHandle )

## showDirectoryPicker

使用此方法可以打开目录选择文件夹，如果只选择单个文件，可以使用 `showOpenFilePicker`.

此类方法返回的是个`promise`对象，所以需要使用 `async/await`进行结果处理。

可以使用对应的API进行特定文件的指定

```js
types: [
  {
    description: "Images",
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
  },
],
```

API使用说明: [showOpenFilePicker](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/showOpenFilePicker)

## FileSystemHandle

使用上述API选择文件之后，会返回对应的`FileSystemFileHandle`或者`FileSystemDirectoryHandle`

`FileSystemFileHandle`可以通过 `getFile()` 或者 `createWritable()` 方法进行文件的读取和保存。

```js
// 读取文件
    function readFile(filehandle){
      return new Promise(async (resolve, reject) => {
        try {
          const file = await filehandle.getFile();
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result)
          };
          reader.readAsText(file); 
        } catch (error) {
          reject(error)
        }
      })
    }

    // 保存文件
    async function saveFile(fileHandle, text){
      // 创建一个可写流
      const writable = await fileHandle.createWritable();
      // 写入数据
      await writable.write(text);

      // 关闭流
      await writable.close();
    }
```

`FileSystemDirectoryHandle` 可以通过 `entries()` 获取所有文件（包含dir&file）的名称和handle对象，此时可以递归获取目录

```js
// 递归获取文件目录树
    async function getFilesRecursively(handle) {
      let curData = []
      for await (const [name, fileHandle] of handle.entries()) {
        let curInfo = { label: name, file: null, children: [] }
        if (fileHandle.kind == 'file') {
          // 文件
          curInfo.file = fileHandle
        } else if (fileHandle.kind == 'directory' && !name.startsWith('.')) {
          curInfo.children = await getFilesRecursively(fileHandle)
        }
        curData.push(curInfo)
      }
      return curData
    }
```
