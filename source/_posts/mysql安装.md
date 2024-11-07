---
title: MySQL安装
date: 2020-06-28 11:37:12
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311121333522.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["MySQL","数据库","关系型数据库","安装"]
categories: ["MySQL"]
---



# MySQL简介

+ 概念 : 是现在流行的开源的,免费的 关系型数据库

+ 历史 : 由瑞典MySQL AB 公司开发，目前属于 Oracle 旗下产品。

## 特点 :

+ 免费 , 开源数据库
+ 小巧 , 功能齐全
+ 使用便捷
+ 可运行于Windows或Linux操作系统
+ 可适用于中小型甚至大型网站应用

## 官网 : https://www.mysql.com/

# 安装MySQL

**这里建议大家使用压缩版,安装快,方便.不复杂.**

## 软件下载

+ mysql5.7 64位下载地址:

+ https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.19-winx64.zip

+ **电脑是64位的就下载使用64位版本的！**

## 安装步骤

1. 下载后得到zip压缩包.

2. 解压到自己想要安装到的目录，本人解压到的是E:\Environment\mysql-5.7.19

3. 添加环境变量：我的电脑->属性->高级->环境变量 

4. 选择PATH,在其后面添加: 你的mysql 安装文件下面的bin文件夹

5. 编辑 my.ini 文件 ,注意替换路径位置

    **不要手动创建data文件夹**

    ```INI
    [mysqld]
    basedir=E:\Environment\mysql-5.7.19\
    datadir=E:\Environment\mysql-5.7.19\data\
    port=3306
    skip-grant-tables
    ```

6. 启动管理员模式下的CMD，并将路径切换至mysql下的bin目录，然后输入代码安装mysql

    ```cmd
    mysqld –install
    ```

7. 初始化数据文件 

    ```cmd
    mysqld --initialize-insecure --user=mysql 
    ```

8. 启动mysql 然后用命令进入mysql管理界面（密码可为空）

    ```cmd
    net start mysql
     mysql –u root –p
    ```

9. 进入界面后更改root密码

    ```cmd
    update mysql.user set authentication_string=password('123456') where user='root' and Host = 'localhost';
    ```

10. 刷新权限

    ```cmd
    flush privileges;
    ```

11. 修改 my.ini文件删除最后一句,或者加注释

     ```cmd
     # skip-grant-tables
     ```

12. 重启mysql即可正常使用

       ```cmd
        net stop mysql
        net start mysql
       ```

13. 连接上测试出现以下结果就安装好了

       ![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images/img/20200628124410.png)

+ **如果您以前装过,现在需要重装,一定要将环境清理干净 **
+ **第八步 -p后面不能加空格,否则会被当做密码的内容,导致登录失败**

# 几个基本的数据库操作命令

```sql
update user set password=password('123456')where user='root'; 修改密码
flush privileges;  刷新数据库
show databases; 显示所有数据库
use dbname；打开某个数据库
show tables; 显示数据库mysql中所有的表
describe user; 显示表mysql数据库中user表的列信息
create database name; 创建数据库
use databasename; 选择数据库
 
exit; 退出Mysql
? 命令关键词 : 寻求帮助
-- 表示注释
```

