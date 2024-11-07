---
title: Ngrok
date: 2020-06-26 17:21:25
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311121945233.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["JavaWeb","Ngrok","内网穿透"]
categories: ["Web"]
---

# Ngrok

当我们做完web项目或者做到一半需要给别人展示的时候，我们可以使用Ngrok实现内网穿透让别人通过互联网登录我们网站。	

# 如何注册

+ 首先我们要到 ** Ngrok ** 的官网 http://www.ngrok.cc/，也可以百度搜索**Ngrok**，进入后我们点击注册注册一个账号。

+ 然后我们开通一个通道，如果只是测试可以使用免费服务器但是速度会很慢，连的人越多越慢！！！

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images/img/20200626185412.png)



![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images/img/20200626185650.png)



# Ngrok的Windows使用教程

## 1、下载客户端

根据自己的操作系统去下载对应的 [客户端](https://www.ngrok.cc/download.html)

## 2、启动隧道

![img](http://www.ngrok.cc/_book/images/start/ngrok/2.png)

下载之后得到两个文件，可以通过cmd命令行进到sunny.exe所在的目录执行

```shell
sunny.exe clientid 隧道id
```

多个隧道同时启动

```shell
sunny.exe clientid 隧道id,隧道id
```

另一种方式通过 Sunny-Ngrok启动工具.bat 启动，直接输入隧道id就好了

![img](http://www.ngrok.cc/_book/images/start/ngrok/3.png)

启动成功界面如下 ![img](http://www.ngrok.cc/_book/images/start/ngrok/5.png)



