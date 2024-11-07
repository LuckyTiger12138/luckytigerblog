---
title: IntelliJ IDEA 开启很慢，运行不流畅，大项目卡顿？一招配置解决!
date: 2021-08-23 13:20:03
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311121740062.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["idea","优化","解决问题"]
---

# IntelliJ IDEA 开启很慢，运行不流畅，大项目卡顿？一招配置解决！

## 一、前言

IDEA默认启动配置主要考虑低配置用户，参数不高（默认最低128m，最高512m），导致启动慢，然后运行也不流畅，这里我们需要优化下启动和运行配置；但是在工作中的电脑一般都是8G或者16G的运行内存，所以我们需要手动去修改默认的IDEA配置。

## 二、手动修改IDEA配置

#### 配置查看IDEA内存使用情况

在 Settings -> Appearance & Behavior 设置窗口中，勾选 Show memory indicator 选项，然后主界面右下角会显示 Heap 总大小以及使用状况了。

在验证设置是否生效时候可以查看这里

![img](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202108231321697.png)

#### 修改IDEA配置

打开 idea64.exe.vmoptions 配置文件，在Help -> Edit Custom VM Option...中设置

![img](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202108231321661.png)

默认设置

![img](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202108231321290.png)

关键的三个参数的说明

> 1、-Xms 是最小启动内存参数

> 2、-Xmx 是最大运行内存参数

> 3、-XX:ReservedCodeCacheSize 保留代码占用的内存容量参数

建议手动设置参数值

#### 电脑运行内存为8G的建议

```text
-server
-Xms512m
-Xmx1024m
-XX:ReservedCodeCacheSize=300m
-XX:+UseConcMarkSweepGC
-XX:SoftRefLRUPolicyMSPerMB=50
-ea
-Dsun.io.useCanonCaches=false
-Djava.net.preferIPv4Stack=true
-Djdk.http.auth.tunneling.disabledSchemes=""
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
```

#### 电脑运行内存为16G的建议

```text
server
-Xms1024m
-Xmx2048m
-XX:ReservedCodeCacheSize=500m
-XX:+UseConcMarkSweepGC
-XX:SoftRefLRUPolicyMSPerMB=50
-ea
-Dsun.io.useCanonCaches=false
-Djava.net.preferIPv4Stack=true
-Djdk.http.auth.tunneling.disabledSchemes=""
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
```



为什么初始内存也要设置512或1024M那么大？有文章这样说：此值可以设置与-Xmx相同，以避免每次垃圾回收完成后JVM重新分配内存。

## 三、使用Toolbox设置(推荐)

使用JetBrains官方Toolbox管理idea{% btn 'https://www.jetbrains.com/toolbox-app/',点击下载,anzhiyufont anzhiyu-icon-circle-arrow-right outline  %}

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311121726015.png)







