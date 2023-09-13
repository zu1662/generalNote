// 此示例在浏览器上运行

function getInfo() {
  return fetch('https://echo.apifox.com/get')
}
function m1() {
  return getInfo();
}
function m2() {
  return m1();
}
function m3() {
  return m2();
}
function main() {
  const info = m3()
  console.log(info)
}
 
//改变fetch函数的行为
function run(func) {
  let cache = [];//存储缓存结果；
  let i = 0;//表示第几次调用fetch
  const _originalFetch = window.fetch;
  window.fetch = (...args) => {
    //有缓存的话就交付缓存结果
    if (cache[i]) {
      if (cache[i].status === 'fulfilled') {
        return cache[i].data;
      }
      else if (cache[i].status === 'rejected') {
        throw cache[i].err;
      }
    }
    //没有缓存就定一个，加到缓存中
    const result = {
      status: 'padding',
      data: null,
      err: null
    };
    cache[i++] = result;
    //发送情求
    const prom = _originalFetch(...args).then(res => res.json()).then(
      res => {
        result.status = 'fulfilled';
        result.data = res;
        console.log("res--->", res)
      }, err => {
        result.status = 'rejected';
        result.data = err;
        console.log("err--->", err)
      }
    )
    //报错
    throw prom;
  };
  try {
    func()
  } catch (err) {
    if (err instanceof Promise) {
      const reRun = () => {
        i = 0;
        func();
      }
      err.then(reRun, reRun);
    }
  }
 
}
run(main);