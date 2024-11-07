---
title: Element-tooltip自定义样式
date: 2024-09-03 14:57:24
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202409031623304.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["Element","前端"]
categories: ["前端"]
---

# el-tooltip

el-tooltip要自定义css样式，因为el-tooltip不会将dom元素注入到body中，如下图 与主dom同层级，那么**style lang="scss" scoped>** 局部修饰那就没法生效，所以要使用**:append-to-body="false"** 属性，再使用**this.$refs.comp.appendChild(this.$refs.elTooltip.popperVM.$el)** 将dom添加到父级中



![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202409031519274.png)

**特定: 超出边界元素，自动切的方向**

`append-to-body` 作用:tooltip是否插入到body中. 类型:boolean, 默认:true

该属性默认为true, 如果为true, 则tooltip默认插入到body元素中 设置为false, 则需要使用append方法手动插入. 如:

```vue
<template>
  <div class="main-box-container" ref="mainBox">
    <div class="main-box" >
      <div class="main-box-top"></div>
      <div class="top-title"  ref="comp">

        <el-tooltip class="item" effect="dark" content="Top Left 提示文字提示文字提示文
              字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字"
                    :append-to-body="false"
                    :hide-after="0"
                    ref="elTooltip"
                    placement="top-start">
          <el-button>Ces1222</el-button>
        </el-tooltip>

      </div>
    </div>
  </div>
</template>
<script>
import {screenSize} from "@/assets/dp/js/utils";

export default {
  data() {
    return {
    };
  },
  mounted() {
    // 因为将append-to-body设置成了false, 所以需要手动插入
    this.$refs.comp.appendChild(this.$refs.elTooltip.popperVM.$el)
    screenSize(this.$refs.mainBox);
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
//el-tooltip__popper is-dark tooltip-width
::v-deep {
  .el-tooltip__popper {
    width: 50px !important;
    max-width: 50px !important;
  }
}

.main-box-container {
  background-color: black;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1920px;
  height: 1080px;
  transform-origin: 0px 0px 0px;
}
</style>

```

## 自适应js

```js
// 屏幕缩放  拉伸铺满
// export function screenSize(editorDom) {
//   let screenWidth = document.body.clientWidth || document.documentElement.clientWidth;
//   let screenHeight = document.body.clientHeight || document.documentElement.clientHeight;
//   let defWidth = 1920;
//   let defHeight = 1080;
//   let xScale = screenWidth / defWidth;
//   let yScale = screenHeight / defHeight;
//   editorDom.style.cssText += ';transform: scale(' + xScale + ',' + yScale + ')';
//
//   $(window).resize(() => {
//     let screenWidth = document.body.clientWidth || document.documentElement.clientWidth;
//     let screenHeight = document.body.clientHeight || document.documentElement.clientHeight;
//     xScale = screenWidth / defWidth;
//     yScale = screenHeight / defHeight;
//     editorDom.style.cssText += ';transform: scale(' + xScale + ',' + yScale + ')';
//   })
// }


// 屏幕缩放 左右加空白 锁死比例
export function screenSize(editorDom) {
  var wid = window.innerWidth;
  var hei = window.innerHeight;
  var temp = 1920 / 1080;
  var c_temp = wid / hei;
  if (temp <= c_temp) {
    var h = hei / 1080;
    var translate_w = (wid - 1920 * h) / 2 / h;
    editorDom.style.transform =
      "scale(" + h + ") translate(" + translate_w + "px,0px)";
  } else {
    var r = wid / 1920;
    var translate_h = (hei - 1080 * r) / 2 / r;
    editorDom.style.transform =
      "scale(" + r + ") translate(0px," + translate_h + "px)";
  }
  document.getElementsByTagName("html")[0].style.cssText += ';background: #071A36;';

  $(window).resize(() => {
    document.getElementsByTagName("html")[0].style.cssText += ';background: #071A36;';

    var wid = window.innerWidth;
    var hei = window.innerHeight;
    var temp = 1920 / 1080;
    var c_temp = wid / hei;
    if (temp <= c_temp) {
      var h = hei / 1080;
      var translate_w = (wid - 1920 * h) / 2 / h;
      editorDom.style.transform =
        "scale(" + h + ") translate(" + translate_w + "px,0px)";
    } else {
      var r = wid / 1920;
      var translate_h = (hei - 1080 * r) / 2 / r;
      editorDom.style.transform =
        "scale(" + r + ") translate(0px," + translate_h + "px)";
    }
  })
}
```

上述css可以生效,效果如下 我们将提示框内宽度进行了修改。但在实际使用中会对页面样式做自适应，缩放页面会发现提示框进行了偏移。



![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202409031535995.png)

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202409031535004.png)



`popperOptions.boundariesElement` 默认: 为'body', 可选值: `view`, `html`, `HtmlElement元素`

表示`tooltip`的边界元素.

如:

- 将`placement="top"`, 并将`popperOptions.boundariesElement`设置为一个`Html元素`， 则表示: `tooltip`的最顶部不会超过`popperOptions.boundariesElement`元素的顶部
- 将`placement="bottom"`, 并将`popperOptions.boundariesElement`设置为一个`Html元素`， 则表示: `tooltip`的最底部不会超过`popperOptions.boundariesElement`元素的顶部

```vue
<template>
  <div class="main-box-container" ref="mainBox">
    <div class="main-box" >
      <div class="main-box-top"></div>
      <div class="top-title"  ref="comp">

        <el-tooltip class="item" effect="dark" content="Top Left 提示文字提示文字提示文
              字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字"
                    :popper-options="popperOptions"
                    :append-to-body="false"
                    :hide-after="0"
                    ref="elTooltip"
                    placement="top-start">
          <el-button>Ces1222</el-button>
        </el-tooltip>

      </div>
    </div>
  </div>
</template>
<script>
import {screenSize} from "@/assets/dp/js/utils";

export default {
  data() {
    return {
      popperOptions: { boundariesElement: this.$refs.comp, gpuAcceleration: true },
    };
  },
  mounted() {
    // 因为将append-to-body设置成了false, 所以需要手动插入
    this.popperOptions = {
      ...this.popperOptions,
      boundariesElement: this.$refs.comp,
    }
    this.$refs.comp.appendChild(this.$refs.elTooltip.popperVM.$el)
    screenSize(this.$refs.mainBox);
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
//el-tooltip__popper is-dark tooltip-width
::v-deep {
  .el-tooltip__popper {
    width: 50px !important;
    max-width: 50px !important;
  }
}

.main-box-container {
  background-color: black;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1920px;
  height: 1080px;
  transform-origin: 0px 0px 0px;

}
</style>

```

