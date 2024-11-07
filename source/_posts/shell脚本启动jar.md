---
title: Shell脚本启动Java程序
date: 2024-08-13 10:56:47
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141520234.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["Linux","Jar","Shell","安装"]
categories: ["Linux"]
---

# Shell脚本

## 简介

 [Shell Script](https://baike.baidu.com/item/ShellScript/18662947?romModule=lemma_inlink) ，Shell脚本与Windows/Dos下的[批处理](https://baike.baidu.com/item/批处理/1448600?fromModule=lemma_inlink)相似，也就是用各类命令预先放入到一个文件中，方便一次性执行的一个[程序文件](https://baike.baidu.com/item/程序文件/10510952?fromModule=lemma_inlink)，主要是方便管理员进行设置或者管理用的。但是它比[Windows](https://baike.baidu.com/item/Windows/165458?fromModule=lemma_inlink)下的批处理更强大，比用其他编程[程序编辑](https://baike.baidu.com/item/程序编辑/0?fromModule=lemma_inlink)的程序效率更高，它使用了Linux/Unix下的命令。

## 概念区别

​	shell和shell脚本有什么区别？确切一点说，Shell就是一个[命令行解释器](https://baike.baidu.com/item/命令行解释器/0?fromModule=lemma_inlink)，它的作用就是遵循一定的语法将输入的命令加以解释并传给系统。它为用户提供了一个向Linux发送请求以便运行程序的接口系统级程序，用户可以用Shell来启动、挂起、停止甚至是编写一些程序。 Shell本身是一个用C语言编写的程序，它是用户使用Linux的桥梁。Shell既是一种命令语言，又是一种[程序设计语言](https://baike.baidu.com/item/程序设计语言/0?fromModule=lemma_inlink)(就是你所说的shell脚本)。作为命令语言，它互动式地解释和执行用户输入的命令；作为程序设计语言，它定义了各种变量和参数，并提供了许多在高阶语言中才具有的控制结构，包括循环和分支。它虽然不是 Linux系统[内核](https://baike.baidu.com/item/内核/0?fromModule=lemma_inlink)的一部分，但它调用了系统内核的大部分功能来执行程序、创建文档并以并行的方式协调各个程序的运行。

# 脚本使用

​	在实际部署环境下因为每个jar包对于不同环境下使用脚本启动会加快速度，例如使用一个reload命令 他的作用是先停止旧包 将旧包名改名为xxxx-日期.jar 作为备份 然后启动新包，做到一个命令执行 停止-备份-启动，减低了部署难度提高了效率。

## JDK环境部署

### 离线安装包下载
 [JDK环境一键安装](https://www.123pan.com/s/rQ0jVv-PvHnH.html) 
### 安装教程

1. 下载后得到7z压缩包.

2. 解压到自己想要安装到的目录，本人解压到/home/jdk

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
   
   ![成功图](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141010566.png)

## 操作Jar包程序

### 脚本内容

```shell
#要启动的jar名称
App=test
AppName=$App.jar
#原始包名称 用于新老包交替使用
AppSourceName=test-admin.jar
# jar包存放路径
AppPath=/home/test/
# JVM参数
JVM_OPTS="-Dname=$AppName  -Duser.timezone=Asia/Shanghai -Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m -XX:+HeapDumpOnOutOfMemoryError -XX:+PrintGCDateStamps  -XX:+PrintGCDetails -XX:NewRatio=1 -XX:SurvivorRatio=30 -XX:+UseParallelGC -XX:+UseParallelOldGC"
APP_HOME=`pwd`
LOG_PATH=$APP_HOME/logs/$AppName.log

if [ "$1" = "" ];
then
    echo -e "\033[0;31m 未输入操作名 \033[0m  \033[0;34m {start|stop|restart|status} \033[0m"
    exit 1
fi

if [ "$AppName" = "" ];
then
    echo -e "\033[0;31m 未输入应用名 \033[0m"
    exit 1
fi

function start()
{
    PID=`ps -ef |grep java|grep $AppName|grep -v grep|awk '{print $2}'`

	if [ x"$PID" != x"" ]; then
	    echo "$AppName is running..."
	else
		nohup java $JVM_OPTS -jar $AppPath$AppName > output.log  2>&1 &
		echo "Start $AppName success..."
	fi
}

function stop()
{
    echo "Stop $AppName"

	PID=""
	query(){
		PID=`ps -ef |grep java|grep $AppName|grep -v grep|awk '{print $2}'`
	}

	query
	if [ x"$PID" != x"" ]; then
		kill -TERM $PID
		echo "$AppName (pid:$PID) exiting..."
		while [ x"$PID" != x"" ]
		do
			sleep 1
			query
		done
		echo "$AppName exited."
	else
		echo "$AppName already stopped."
	fi
}

function restart()
{
    stop
    sleep 2
    start
}

function reload()
{

     stop
    	sleep 2
    	TIME=""
    	TIME=$(date "+%Y-%m%d-%H%M")
    	NEWFILENAME=$App"-"$TIME".jar"
	OLDFILESTAT=`mv ./$AppName ./$NEWFILENAME`
	
	STARFILESTAT=`mv ./$AppSourceName ./$AppName`
     start
    	echo "$NEWFILENAME already reload."
    	
    	
}
function status()
{
    PID=`ps -ef |grep java|grep $AppName|grep -v grep|wc -l`
    if [ $PID != 0 ];then
        echo "$AppName is running..."
    else
        echo "$AppName is not running..."
    fi
}

case $1 in
      start)
    start;;
    stop)
    stop;;
    restart)
    restart;;
    status)
    status;;
    reload)
    reload;;
    *)

esac
```

### 具体方法解释

#### 启动（start）

```shell
function start()
{
    PID=`ps -ef |grep java|grep $AppName|grep -v grep|awk '{print $2}'`

	if [ x"$PID" != x"" ]; then
	    echo "$AppName is running..."
	else
		nohup java $JVM_OPTS -jar $AppPath$AppName > output.log  2>&1 &
		echo "Start $AppName success..."
	fi
}
```

此方法先去查询是否已经启动，存在打印  {% emp $AppName is running.. %} ，不存在则nohup 后台启动 JVM_OPTS中可配置优化配置 比如对于cloud项目 可修改其中nacos配置，提供的代码中写死了生成 output.log文件，但这里其实应该是 {% wavy /dev/null  %} 搭配   [logback.xml](https://www.123pan.com/s/rQ0jVv-mdHnH.html) 生成日志。

```shell
  #nacos 配置
  -Dspring.cloud.nacos.discovery.server-addr=10.10.10.10:8848
  -Dspring.cloud.nacos.discovery.namespace=123-123-123-123
  -Dspring.cloud.nacos.discovery.group=test
  -Dspring.cloud.nacos.config.server-addr=10.10.10.10:8848
  -Dspring.cloud.nacos.config.namespace=123-123-123-123
  #搭配logback
  nohup java $JVM_OPTS -jar $AppName > /dev/null  2>&1 &
```

```shell
 # 赋权
 chmod +x ./test-admin.sh
 # start 启动
 /test-admin.sh start
```

#### 停止（stop）

```shell
function stop()
{
    echo "Stop $AppName"

	PID=""
	query(){
		PID=`ps -ef |grep java|grep $AppName|grep -v grep|awk '{print $2}'`
	}

	query
	if [ x"$PID" != x"" ]; then
		kill -TERM $PID
		echo "$AppName (pid:$PID) exiting..."
		while [ x"$PID" != x"" ]
		do
			sleep 1
			query
		done
		echo "$AppName exited."
	else
		echo "$AppName already stopped."
	fi
}
```

此方法内部定义了一个query方法查询是否已经启动，不存在打印  {% emp $AppName already stopped. %} ，存在进行kill 关闭并递归再次query

```shell
 # 赋权
 chmod +x ./test-admin.sh
 # start 启动
 /test-admin.sh stop
```

#### 重启（restart）

```shell
function restart()
{
    stop
    sleep 2
    start
}
```

此方法先执行stop方法，延时2ms 执行启动方法

```shell
 # 赋权
 chmod +x ./test-admin.sh
 # start 启动
 /test-admin.sh restart
```

#### 重载（reload）

```shell

function reload()
{

     stop
     sleep 2
     TIME=""
     TIME=$(date "+%Y-%m%d-%H%M")
     NEWFILENAME=$App"-"$TIME".jar"
	 OLDFILESTAT=`mv ./$AppName ./$NEWFILENAME`
	 STARFILESTAT=`mv ./$AppSourceName ./$AppName`
     start
     echo "$NEWFILENAME already reload."
    	
}
```

此方法先去执行停止方法，延时2ms后获取当前时间 修改旧包名，将新包改名后执行启动方法。例如定义启动的jar(AppName)为test.jar 上传一个名(AppSourceName)为admin的包 ，执行reload方法后 会剩余一个test-2024-08141050.jar和一个test.jar

​	![执行前](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141051666.png)

​	![执行后](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202408141052224.png)


```shell
 # 赋权
 chmod +x ./test-admin.sh
 # start 启动
 /test-admin.sh reload
```

#### 查状态（status）


```shell
function status()
{
    PID=`ps -ef |grep java|grep $AppName|grep -v grep|wc -l`
    if [ $PID != 0 ];then
        echo "$AppName is running..."
    else
        echo "$AppName is not running..."
    fi
}
```

此方法先去查询jar包状态打印是否启动。

```shell
 # 赋权
 chmod +x ./test-admin.sh
 # start 启动
 /test-admin.sh status
```

## 开机自启

### 简介

经常碰到机器断电之后需要重启一大堆服务，为了防止这种事情发生，设置开机自启的脚本十分的重要，我们习惯性的做法就是编写一个重启脚本，然后在 /etc/rc.local 中去完成开机执行。例如下面这样：

```shell
$ cat /etc/rc.local
bash /root/script/restart.sh
```

**注意 如果是自启动上述的脚本，要注意比如jar包、写死的log日志最好都是写全路径**

这样的方法虽然可行，但并不优雅。今天我们就给大家介绍两种更好的实现方式：

### 通过 Crontab 实现

Crontab 可以使用 @reboot 来执行主机启动之后的命令。首先在命令行输入：

```text
$ crontab -e
```

然后添加以下内容：

```text
@reboot /home/test/test-admin.sh start
```

完成后，这个脚本就可以在重启的时候自动执行了。

其它的一些进阶玩法：

在启动完成后的指定时间内运行脚本

```shell
# 在启动 5 分钟后运行指定脚本
@reboot sleep 300 &&  /home/test/test-admin.sh start
```

### 通过 Systemd 实现

首先编写一个名为 restart 的 Systemd 服务：

```text
$ vim /lib/systemd/system/restart.service

[Unit]
Description=restart
After=default.target

[Service]
ExecStart=/home/test/test-admin.sh start

[Install]
WantedBy=default.target
```

然后启用这个 Systemd 服务：

```text
$ systemctl daemon-reload
$ systemctl enable restart.service
```

完成后，这个服务对应的脚本就可以自动开机自启了。
