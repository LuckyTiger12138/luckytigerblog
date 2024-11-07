---
abbrlink: ''
categories:
- 前端
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311122010771.png
date: '2021-03-28T13:35:42+08:00'
tags:
- Echarts
- 前端
title: Echarts-树形关系图
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
updated: '2024-11-07T11:52:55.595+08:00'
---
# Echarts

## 1.点击事件1

```javascript
ECharts 点击事件的 param参数
var myChart = echarts.init(document.getElementById("echarts"));
myChart.on('click', function (param) {  
 myChart.off('click') // 这里很重要 ，防止重复点击事件！！！
     alert(param.seriesName);  //legend的名称
    alert(param.name);  //X轴的值
});
myChart.setOption(option,true);// 使用刚指定的配置项和数据显示图表。
```

**param参数包含的内容有：**

```JavaScript
param.name：X轴的值
param.data：Y轴的值
param.value：Y轴的值
param.type：点击事件均为click
param.seriesName：legend的名称
param.seriesIndex：系列序号（series中当前图形是第几个图形第几个）
param.dataIndex：数值序列（X轴上当前点是第几个点）
```

## 2.tree 点击后使另一个关闭，同级别最多展示一个

```javascript
//version  Echarts 5.1.2
ChartEl.on("mouseover", function (param) {
        if (typeof param.seriesIndex == 'undefined') {
            return;
        }
        if (param.type == 'mouseover') {

        if (param.data.level==2){


                const dataIndex = param.dataIndex;
                const curNode = ChartEl._chartsViews[0]._data.tree._nodes.find(item => {
                    return item.dataIndex === dataIndex;
                });
                const depth = 2;
                const curIsExpand = curNode.isExpand;

                ChartEl._chartsViews[0]._data.tree._nodes.forEach((item, index)=> {
                    if (item.depth === depth   && dataIndex != item.dataIndex  ) {

                        item.isExpand = false;
                    }
                })

                ChartEl._chartsViews[0]._data.tree._nodes.forEach((item, index)=> {
                    if (dataIndex === item.dataIndex   &&curIsExpand  ) {
                        item.isExpand = true;
                    }

                })
            }
        }
    })
```

## 3.tree 树图点击点击后获取父级的data数据

```javascript
//version  Echarts 5.1.2
ChartEl.on("click", function (param) {
        if (typeof param.seriesIndex == 'undefined') {
            return;
        }
        if (param.type == 'click') {

            if (param.data.level==3){

            var dataindexParent=param.treeAncestors[2].dataIndex
                console.log(dataindexParent) //得到父级的dataindex
              
                console.log(ChartEl._chartsViews[0]._data._rawData._data[dataindexParent])
		ChartEl._chartsViews[0]._data._store._provider._data[param.treeAncestors[2].dataIndex].id
            }
     
                }
    })
```

## 4.tree 树图层级覆盖问题

```javascript
 config.data.children.forEach(function (datum, index) {
        index  != 0 && (datum.collapsed = true);
    });//默认情况下最后子节点 只有第一个展开

 // initialTreeDepth: 1, 必须注掉


```

```javascript
edgeForkPosition:"90%", //分节点到label的长度 数值越大长度越少
   label: {
       align: 'left',//节点在label左侧
   }
```

## 5.tree 样式美化

```javascript
 //线发光
lineStyle: {
                shadowColor: "#ecf390",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 8, type: "solid",

                color: new Echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    '#eef269', '#d88a40'
                ].map((color, offset) => ({
                    color,
                    offset
                }))),
            },
//单独设置label背景图片
rich: {
       a: {
           padding: [10,5,10,5],
           borderRadius: 10,
           align:'center',
           fontSize: 20,
           fontWeight: 'bolder',
           color: '#fff',
           backgroundColor: {
           image:'data:image/png;base64,iVBORi, }
            // backgroundColor: '#1070FC'
           }
       }  
```
