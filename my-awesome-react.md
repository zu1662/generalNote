# 前言
此文档记录自己在使用React时，所发现的比较不错的组件，并记录其简单用法。

## *Swiper*
### `react-id-swiper` 
- 安装： `npm install --save react-id-swiper` 
- github地址：https://github.com/kidjp85/react-id-swiper
- 此组件基于Swiper，API地址为：http://idangero.us/swiper/api/
- 简单用法，在 `render` 内：  
  ```javascript
    const params = {
        pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
        }
    }

    <Swiper {...params} ref={this.Swiper}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
    </Swiper>
  ```
  1. 通过 `params` 可以进行配置参数信息。  
  2. 通过 `ref`可以获取swiper实例。具体方法为：  
    在 `constructor` 内设置 `ref` : `  this.Swiper = React.createRef()`  
    通过 `this.Swiper.current.swiper` 获取 `swiper` 实例。可有方法和属性进行相关操作。

## `better-scroll` 
- 安装： `npm install better-scroll --save`
- github地址：https://github.com/ustbhuangyi/better-scroll
- 文档API： https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/
- 说明： 此组件不止应用于 `React` 中，同时也可以在 `Vue` 以及原生的 `HTML` 结构中使用
- 用法：  
  ```javascript
    <div class="wrapper">
        <ul class="content">
            <li>...</li>
            <li>...</li>
            ...
        </ul>
        <!-- 这里可以放一些其它的 DOM，但不会影响滚动 -->
    </div>

    import BScroll from 'better-scroll'
    let scroll = new BScroll('.wrapper')
  ```
  在之后的使用中，可以直接使用 `scroll.scrollToElement` 等方法进行API的使用。具体参见文档。  
  此组件在列表导航，根据字母进行导航跳转等有比较好的应用。