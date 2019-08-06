## 方法一： 使用jquery进行横屏处理
```
fullScreen(){
    let width = window.innerWidth
    let height = window.innerHeight
    $('.class').css({
        'width': width + 'px',
        'height': height + 'px',
        'transform-origin': `${width/2}px center`,
        'transition-duration': '0.8s',
        'transform': 'rotate(90deg)' 
    }).show()
}
```
再html中使用：
```
<div class="full" :style="fullScreen()"><div>
```
## 方法二： 使用自定义指令的方式进行处理
```
directives: {
        'horizontal-screen': {
            inserted(el, binding, vnode){
                let self = vnode.context;
                
                function reset(init){
                    
                    let width = document.documentElement.clientWidth,
                        height = document.documentElement.clientHeight;
                    //在竖屏状态我们通过添加transform:rotate(90deg)，来让这个页面横过来
                    if(window.orientation == null || window.orientation === 180 || window.orientation === 0){//竖屏状态
                        el.style.webkitTransform = el.style.transform = `rotate(90deg)`;
                        el.style.width = `${height}px`;
                        el.style.height = `${width}px`;
                        el.style.webkitTransformOrigin = el.style.transformOrigin = `${width / 2}px center`;
                        //如果已经处于横屏状态就不做其他处理了
                    }else if(window.orientation === 90 || window.orientation === -90){//横屏状态
                        el.style.webkitTransform = el.style.transform = `rotate(0)`;
                        el.style.width = `${width}px`;
                        el.style.height = `${height}px`;
                    }
                }
                reset(true);

                let timer = null;
                el.fn = function(e) {
                    clearTimeout(timer);
                    timer = setTimeout(reset, 300);
                }
                
                window.addEventListener('resize', el.fn, false);

                if("onorientationchange" in window){
                    window.addEventListener('orientationchange', el.fn, false);
                }
            },
            unbind(el, binding, vnode){
                window.removeEventListener('resize', el.fn, false);
                window.removeEventListener('orientationchange', el.fn, false);
            }
        },
```
再html中使用：
```
<div class="full" v-horizontal-screen><div>
```