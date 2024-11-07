---
title: mkcert自签SSL证书
date: 2024-08-14 17:03:35
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151118289.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["Linux","Windows","证书","SSL","mkcert","Https","Nginx"]
categories: ["Linux"]
---

# mkcert

## 简介

mkcert是一个用于生成本地自签名SSL证书的开源工具。它基于Golang开发，可以跨平台使用，不需要进行复杂配置，且能自动信任CA。此外，mkcert支持单域名、多域名以及IP，为开发者提供了极大的便利。 请注意，mkcert生成的证书主要用于本地开发和测试环境，不适合在生产环境中使用。在生产环境中，应使用由受信任的证书颁发机构（CA）签发的证书，以确保安全性和用户信任。

## 下载

这个是官网的地址： [Releases · FiloSottile/mkcert (github.com)](https://github.com/FiloSottile/mkcert/releases) 

![版本选择](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141716037.png)

### Windows版本选择

```cmd
echo %PROCESSOR_ARCHITECTURE%
```

![img](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141717720.png)

 ![img](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141717790.png) 

### Linux版本选择

```shell
	lscpu | grep Architecture
```

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141722506.webp)

如果输出结果中包含 `x86_64` 或 `i686`，则表示[系统](https://so.csdn.net/so/search?q=系统&spm=1001.2101.3001.7020)的 CPU 架构是 `AMD`（或者是 x86 [架构](https://so.csdn.net/so/search?q=架构&spm=1001.2101.3001.7020)的 Intel
[CPU](https://so.csdn.net/so/search?q=CPU&spm=1001.2101.3001.7020)）。如果输出结果中包含 `armv7l`、`aarch64` 或 `arm64`，则表示系统的 CPU 架构是 `ARM`。

![linux-amd64](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141724306.png)

## 安装

### Windows安装

#### 管理员运行CMD，install安装

使用管理员模式运行cmd，进入安装文件目录执行以下安装命令安装mkcert。将CA证书加入本地可信CA，使用此命令，就能帮助我们将mkcert使用的根证书加入了本地可信CA中，以后由该CA签发的证书在本地都是可信的,弹出的安全警告点击是。

```cmd
cd c:\mkcert
#安装命令
mkcert-v1.4.4-windows-amd64.exe -install
#卸载命令
mkcert-v1.4.4-windows-amd64.exe -uninstall
```

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141756594.png)

**安装成功成功。提示创建一个新的本地CA，本地CA现在已安装在系统信任存储中。**

![image-20240815091609607](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408150916702.png)

#### 测试mkcert是否安装成功

```cmd
mkcert-v1.4.4-windows-amd64.exe --help
```

![image-20240815091938791](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408150919832.png)

#### 查看CA证书存放位置

```cmd
mkcert-v1.4.4-windows-amd64.exe --CAROOT
```

![image-20240815092115644](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408150921686.png)



#### 查看证书控制台

**按“Windows键+R”调出运行框，输入certmgr.msc命令。打开证书控制台。**

![image-20210813112136872](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408150922938.png)

![image-20240815092211074](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408150922124.png)

![image-20240815092333071](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408150923112.png)

#### 生成自签证书,可供局域网内使用其他主机访问

直接跟多个要签发的域名或 ip 就行了，比如签发一个仅本机访问的证书(可以通过`127.0.0.1`和`localhost`，以及 ipv6 地址`::1`访问)

需要在局域网内测试 https 应用，这种环境可能不对外，因此也无法使用像`Let's encrypt`这种免费证书的方案给局域网签发一个可信的证书，而且`Let's encrypt`本身也不支持认证 Ip。

证书可信的三个要素:

- 由可信的 CA 机构签发
- 访问的地址跟证书认证地址相符
- 证书在有效期内

如果期望自签证书在局域网内使用，以上三个条件都需要满足。很明显自签证书一定可以满足证书在有效期内，那么需要保证后两条。我们签发的证书必须匹配浏览器的地址栏，比如局域网的 ip 或者域名，此外还需要信任 CA。操作如下。 签发证书，加入局域网IP地址。

```cmd
mkcert-v1.4.4-windows-amd64.exe localhost 127.0.0.1 ::1 192.168.109.129
# 这个192.168.109.129是我的电脑的地址，这里根据根据自己的电脑ip进行设定,windows 可用ipconfig命令查看
```

![image-20240815102807646](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151028687.png)

#### Nginx测试

##### 下载Nginx

到nginx官网（ [nginx: download](https://nginx.org/en/download.html)）下载nginx

![img](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151029414.png)

##### 解压安装包，并放置证书文件

下载成功后，将下载的zip包，根据自己的情况，放到对应的目录下，解压。（**这里有一点值得注意的是，nginx最好放在非中文目录下，在nginx-1.24.0版本之前，nginx放在有中文的目录下，时无法启动nginx的**）。创建一个ssl文件夹将刚才生成的ssl文件放到里面。

![image-20240815103220035](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151032074.png)

##### 修改conf文件

编辑bin目录下nginx.conf文件，配置ssl，这里用443端口代理html下的静态文件

```conf

worker_processes  1;
events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;

    keepalive_timeout  65;

    server {
        listen    443 ssl;
        server_name  localhost;
        ssl_certificate      ..//ssl//localhost+3.pem;
        ssl_certificate_key  ..//ssl//localhost+3-key.pem;
        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;
        root html;
              charset 'utf-8';

	location / {
     root   html;
            index  index.html index.htm;
            charset utf-8;
        }

}
}
```

##### 双击启动

![image-20240815104356108](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151043161.png)

##### 浏览器访问

![image-20240815104531181](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151045244.png)

![image-20240815104559012](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151045076.png)

#### 局域网其他设备访问

将CA证书复制给需要访问的局域网设备，安装后就可以通过https://192.168.109.129:443 安全访问了

![image-20240815104741535](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151047575.png)

#####  <span id="pc">PC安装</span>

将 rootCA.pem 复制到 PC 上，并将其后缀改为 .crt

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151052815.png)

双击 `rootCA.crt`，根据提示安装证书即可（**注意证书存储时要点击浏览选择受信任的根证书颁发机构**）。

![image-20240815105304334](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151053392.png)![image-20240815105326148](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151053202.png)



![image-20240815105354289](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151053359.png)

![image-20240815105410162](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151054215.png)

![image-20240815105514878](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151055926.png)

![image-20240815105533037](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151055080.png)

##### <span id="az">安卓安装</span>

这里以小米14为例

1. 打开设置选择 **隐私与安全**

   ![image-20240815105845023](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151058082.png)

2. 安全选项卡中选择**更多安全设置**

   ![image-20240815105921874](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151059925.png)

3. 更多安全设置页面下滑到最底层 选择 **更多安全设置 加密、凭证等**

   ![image-20240815110014789](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151100847.png)

4. 加密与凭证中选择**从存储设备安装证书**

   ![image-20240815110130645](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151101716.png)

5. 安装证书中选择**CA证书**

   ![image-20240815110225897](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151102966.png)

6. 选择**仍然按照**

   ![image-20240815110251909](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151102969.png)

7. 选择刚才生成的rootCA.pem

   ![image-20240815110332506](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151103580.png)

8. 安装成功

![image-20240815110428837](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151104901.png)

### Linux安装

{% link 参考这篇博客安装,Linux下使用Docker部署Nginx,https://blog.luckytiger12138.top/2024/08/13/linux%E4%B8%8B%E4%BD%BF%E7%94%A8Docker%E9%83%A8%E7%BD%B2nginx/,https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151716564.png %}



#### 赋权，install安装

将对应版本的mkcer复制到服务器上，这里我创建了/home/mkcert进行操作，复制后给文件进行赋权再安装

```shell
mkdir /home/mkcert
cd /home/mkcert
chmod +x ./mkcert-v1.4.3-linux-amd64
./mkcert-v1.4.3-linux-amd64  --install
```



![image-20240815120555605](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151205662.png)
![image-20240815120547500](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151205560.png)

![image-20240815120615116](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151206169.png)

#### 测试mkcert是否安装成功

```cmd
./mkcert-v1.4.3-linux-amd64  --help
```

![image-20240815120923283](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151209446.png)

#### 查看CA证书存放位置

```cmd
./mkcert-v1.4.3-linux-amd64  --CAROOT
```

![image-20240815120940444](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151209481.png)

#### 生成自签证书,可供局域网内使用其他主机访问

```shell
./mkcert-v1.4.3-linux-amd64 localhost 127.0.0.1 ::1 192.168.109.130
# 这个192.168.109.129是我的电脑的地址，这里根据根据自己的电脑ip进行设定,linux 可用ifconfig命令查看
```

#### Nginx测试

##### 安装

{% link 参考这篇博客安装,https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141515745.png,https://blog.luckytiger12138.top/2024/08/13/linux%E4%B8%8B%E4%BD%BF%E7%94%A8Docker%E9%83%A8%E7%BD%B2nginx/ %}

##### 放置证书文件

```shell
mkdir /home/nginx/ssl
```

![image-20240815151041342](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151634474.png)

##### 启动脚本

```shell
docker run  \
-p 8991:80 \
--name nginx \
--restart=always \
-v /home/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /home/nginx/conf/conf.d:/etc/nginx/conf.d \
-v /home/nginx/log:/var/log/nginx \
-v /home/nginx/html:/usr/share/nginx/html \
-v /home/nginx/ssl:/usr/share/nginx/ssl \
-d nginx:latest
```

##### 修改conf文件

```conf
server {
     listen    80 ssl;
	server_name  localhost;
	ssl_certificate      /usr/share/nginx/ssl/localhost+3.pem;
	ssl_certificate_key  /usr/share/nginx/ssl/localhost+3-key.pem;
	ssl_session_cache    shared:SSL:1m;
	ssl_session_timeout  5m;
	ssl_ciphers  HIGH:!aNULL:!MD5;
	ssl_prefer_server_ciphers  on;
	root html;
	         charset 'utf-8';

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        index  index.html index.htm;
    }
    
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }


    location /prod-api/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://test:8080/;
        }      
}
```

##### 浏览器访问

![image-20240815162609974](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151634442.png)

![image-20240815162627553](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151633491.png)

#### 局域网其他设备访问

将CA证书复制给需要访问的局域网设备，安装后就可以通过https://192.168.109.130:8991 安全访问了，具体参考  <a href="#pc">PC安装</a>     <a href="#az">安卓安装</a>

![image-20240815162837843](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408151633729.png)
