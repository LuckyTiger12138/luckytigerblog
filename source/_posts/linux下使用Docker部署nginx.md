---
title: Linux下使用Docker部署Nginx
date: 2024-08-13 10:56:28
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141515745.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["Linux","Docker","Nginx","安装"]
categories: ["Linux"]
---

# Docker简介

​	Docker是一个开源的平台 ，用于开发、交付和运行应用程序。它能够在[Windows](https://baike.baidu.com/item/Windows/165458?fromModule=lemma_inlink)，[macOS](https://baike.baidu.com/item/macOS/8654551?fromModule=lemma_inlink)，[Linux](https://baike.baidu.com/item/Linux/27050?fromModule=lemma_inlink)计算机上运行，并将某一应用程序及其依赖项打包至一个容器中，这些容器可以在任何支持Docker的环境中运行。容器彼此隔离，但可以通过特定的通道相互传递信息。

Docker提供了一个轻量级的虚拟化解决方案。由于运行在同一计算机上的所有容器共享同一个操作系统内核，避免了启动与维护虚拟机的开销。因此相比于传统的虚拟机，Docker容器更加轻便、快速、容易部署。使用Docker，开发者可以避免在两台计算机上运行效果不一致的问题，容器提供了一致的行为，进而使得应用程序在不同环境的计算机上有相同的运行效果。

## 特点

+ 更高效的利用系统资源
+ 更快速的启动时间
+ 一致的运行环境
+ 持续交付的部署
+ 更轻松的迁移
+ 更轻松的维护和维护

## 官网

{% link Docker官网,Docker官网需要魔法,https://www.docker.com,https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408131207330.svg  %}

# 安装docker

## 离线安装包下载

 [Docker环境一键安装](https://www.123pan.com/s/rQ0jVv-iTHnH.html) 

## 安装教程


1. 下载后得到7z压缩包.

2. 解压到自己想要安装到的目录，本人解压到/home/docker

   ```shell
   mkdir /home/docker
   ```

3. 进入目录赋权

   ```shell
   cd /home/docker
   chmod +x ./*
   ```

4. 执行安装脚本

   ```shell
   ./install.sh
   ```

   

# 几个基本的docker命令

```shell
docker ps #查看正在运行的容器
docker ps -a #查看所有容器
docker images #查看镜像
docker cp /home/nginx/conf nginx:/etc/conf #将/home/nginx/conf目录 复制到nginx容器的/etc/conf
docker save -o my_ubuntu_v3.tar runoob/ubuntu:v3 #将镜像runoob/ubuntu:v3 生成my_ubuntu_v3.tar文件
docker load -i mynginx.tar #从文件加载镜像
docker update --restart=always nginx #修改nginx容器为自启动
```

# 内网环境安装Nginx

​	因为很多时候内网服务器安装一些程序 如mysql、nginx、redis、gitlab  因为无网络环境 一些环境包不好安装。所以推荐使用docker，先在外网研发电脑打包镜像  然后传到内网使用。接下来我将用nginx作为演示 其中的nginx.tar 可自行使用save命令保存自己环境的镜像。

## 离线安装包下载

 [Nginx镜像+环境压缩包](https://www.123pan.com/s/rQ0jVv-JvHnH.html) 
## 安装教程

1. 下载后得到zip压缩包.

2. 解压到自己想要安装到的目录，本人解压到/home/nginx

   ```shell
   mkdir /home/nginx
   ```

   ![上传](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408131548321.png)

3. 进入目录，使用 load命令加载镜像

   ```shell
   cd  /home/nginx
   docker load -i nginx.tar
   ```

   ![加载](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408131552003.png)

4. 复制nginx创造脚本命令.txt 文件中的命令执行创建容器

   ![image-20240813155514557](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408131555802.png)

5. 进入conf.d文件夹内修改配置

   ```shell
   cd /home/nginx/conf/conf.d
   ```

6. blocksip.conf文件夹是配置白名单，只有里面写到的ip才允许访问，不需要可删除。

7. defalut.conf中提供了前端镜像代理和后端接口代理，注意如果要新增静态文件代理 需要注意文件路径是否在创建容器时有进行代理

   ![image-20240813155835917](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408131558981.png)
