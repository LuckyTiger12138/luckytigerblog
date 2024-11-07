---
title: MySQL-JDBC&连接池
date: 2020-06-30 15:04:15
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311121855703.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["数据库","dbcp","c3p0","并发","JDBC","MySQL"]
categories: ["数据库"]
---

# JDBC，通过java来操作数据库

https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311121855703.png

## JDBC概述

 JDBC API允许用户访问任何形式的表格数据，尤其是存储在关系数据库中的数据，JDBC其实是一套接口，定义了java操作数据库的规范，各家数据库厂商，想要使用java语言，跟自家数据库建立连接，需要自己去实现驱动，数据库厂商写的这套实现类称为数据库驱动。

## 操作流程

1. 导入数据库厂商写的驱动，也就是jar包

   ```XML
    <dependency>
       <groupId>mysql</groupId>
       <artifactId>mysql-connector-java</artifactId>
       <version>5.1.41</version>
   </dependency>
   <dependency>
       <groupId>org.apache.commons</groupId>
       <artifactId>commons-dbcp2</artifactId>
       <version>2.0.1</version>
   </dependency>
   ```

2. 加载驱动，drive文件的全路径

3. 建立连接

4. .获取操作对象

5. 编写SQL语句

6. 执行SQL语句

7. 释放资源

## 往数据库中插入数据

```java
public class 连接数据库 {
public static void main(String[] args) throws ClassNotFoundException, SQLException {
//加载驱动
Class.forName("com.mysql.jdbc.Driver");
 //建立连接
String url="jdbc:mysql://localhost:3306/mydb";
String username="root";
String password="123456";
Connection conn = DriverManager.getConnection(url, username, password);
//获取操作对象
Statement statement = conn.createStatement();
//编写SQL语句
String str="insert into test11(nam,age) values('cc',40)";
//执行DML语句，返回值代表你影响的行数
statement.executeUpdate(str);
//execute：执行任何语句
//释放资源
conn.close();
statement.close();}}
```

## 从数据库中读取数据

```java
public class 读取数据库 {
public static void main(String[] args) throws Exception {
Class.forName("com.mysql.jdbc.Driver");
String url=("jdbc:mysql://localhost:3306/mydb");
String username="root";
String password="123456";
Connection conn = DriverManager.getConnection(url, username, password);
Statement statement = conn.createStatement();
String str="select * from test11";
ResultSet resultSet = statement.executeQuery(str);
ArrayList<Object> list = new ArrayList<>();
// resultset：结果集对象，next方法在resultset对象没有下一行时返回false
while (resultSet.next()){
    int anInt = resultSet.getInt(1);
    String string = resultSet.getString(2);
    int anInt1 = resultSet.getInt(3);
    System.out.println(anInt+"   "+string+"     "+anInt1);
}
System.out.println(list); }}
```

## SQL注入

 如果你通过网页获取用户输入的数据并将其插入一个MySQL数据库，那么就有可能发生SQL注入安全的问题。所谓SQL注入，就是通过SQL命令插入到Web表单递交或输入域名或页面请求的查询字符串，最终达到欺骗服务器执行恶意的SQL命令。

```java
public class LoginDemo {
public static void main(String[] args) throws Exception {
String username="1' or '1'='1";
String password="1' or '1'='1";
//从数据库中查询用户名和密码和用户输入的进行比对
Class.forName("com.mysql.jdbc.Driver");
Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/mydb", "root", "123456");
Statement statement = conn.createStatement();
//编写SQL语句
//不管是1还是1=1都代表true，也就是说条件必为真，数据库一定会登陆成功
//你也可以插入其他的指令，比如String username="1'；delete from users"; 这样会删除整个表的数据
//在PHP中的 mysqli_query() 是不允许执行多个 SQL 语句的，但是在 SQLite 和 PostgreSQL 是可以同时执行多条SQL语句的，所以我们对这些用户的数据需要进行严格的验证。
String sql="select * from users where username='"+username+"' and password='"+password+"'";
//执行SQL语句
ResultSet resultSet = statement.executeQuery(sql);
//我们怎么判断有没有登录成功
boolean b = resultSet.next();
if(b){
    System.out.println("登录成功");
}else{
System.out.println("登录失败");}}}
```

## 使用PreparedStatement预编译操作对象 来防止SQL注入

SQL 语句被预编译并存储在 `PreparedStatement` 对象中。然后可以使用此对象多次高效地执行该语句。

```java
使用步骤：
//使用这一步来代替原来的获取操作对象的那一步
1.conn.prepareStatement(sql);
2.sql语句中的字段的值用?问号占位
3.给sql语句中的问号赋值
//SQL语句中的值 全部用 ? 问号占位
```

```java
public class LoginDemo2 {
public static void main(String[] args) throws Exception {
String username="'1' or '1'='1'";
String password="'1' or '1'='1'";
//从数据库中查询用户名和密码和用户输入的进行比对
Class.forName("com.mysql.jdbc.Driver");
Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/mydb", "root", "123456");
//我们通过createStatement() 获取出的这个操作对象，去执行SQL语句，那么这个sql语句，有时会拼串，不能防止sql注入
//为了预防sql注入，我们可以使用另外一个操作对象
//编写SQL语句
//参数拿 ? 占位 注意：? 是英文 ?
String sql = "select * from users where username=? and password=?";
//PreparedStatement 预编译操作对象，可以提前编译sql语句，能够防止SQL 注入
PreparedStatement preparedStatement = conn.prepareStatement(sql);
//给?赋值
preparedStatement.setString(1,username);
preparedStatement.setString(2,password);
//执行SQL语句
ResultSet resultSet = preparedStatement.executeQuery();           //不要再传入sql语句
boolean b = resultSet.next();
if(b){
    System.out.println("登录成功");
}else{
    System.out.println("登录失败");}}}
```

## 使用ResourceBundle来读取配置文件

```java
//Java提供的一个工具类，可以读取 src目录下的文件  jdbcProperties 
// ResourceBundle 这个类，读取的配置文件，有3点要求，
//1.配置文件要在src 下
 //2.配置文件的后缀名，必须为 .properties
 //3. 文件的后缀名，你在读取的时候，不要写
public class MyTest {
public static void main(String[] args) throws IOException {
ResourceBundle bundle = ResourceBundle.getBundle("jdbcProperties");
//键找值
String className = bundle.getString("className");
String url = bundle.getString("url");
String username = bundle.getString("username");
String password = bundle.getString("password");
System.out.println(className);
System.out.println(url);
System.out.println(username);
System.out.println(password);


// 读取src下的配置文件
InputStream in = MyTest.class.getClassLoader().getResourceAsStream("jdbcProperties.properties");
// Properties properties = new Properties();
//properties.load(in);
//System.out.println(in);
// System.out.println(properties.getProperty("username"));
System.out.println("-----------------------------------------------");
BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(in));
String[] split = bufferedReader.readLine().split("=");
System.out.println(split[0]);
System.out.println(split[1]);}}
```

# 连接池

数据库连接 --- 执行完毕 --- 释放

连接 --- 释放 十分浪费系统费资源

**池化技术：准备一些预先资源，过来就连接预先准备好的**

最小连接数 10

最大连接数 15 

等待超时  ： 100ms

编写连接池，实现一个接口 DataSourse

## 简介

​		由于建立数据库连接是一种非常耗时，耗费资源的行为，所以通过连接池预先同数据库建立一些连接，放在内存中，应用程序需要建立数据库连接时直接到连接池中申请一个就行，使用完毕再归还到连接池中，现在市面上常见的连接池有三种，分别是 DBCP连接池，C3P0连接池，阿里Druid连接池

## DBCP

### 需要用到的jar包

1. commons-dbcp 1.4

   ```XML
   <!-- https://mvnrepository.com/artifact/commons-dbcp/commons-dbcp -->
   <dependency>
       <groupId>commons-dbcp</groupId>
       <artifactId>commons-dbcp</artifactId>
       <version>1.4</version>
   </dependency>
   ```

   

2. commons-pool 1.6

   ```XML
   <!-- https://mvnrepository.com/artifact/commons-pool/commons-pool -->
   <dependency>
       <groupId>commons-pool</groupId>
       <artifactId>commons-pool</artifactId>
       <version>1.6</version>
   </dependency>
   ```

### 新建dbcpconfig.properties文件

```properties
#连接设置
driverClassName=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/school?useUnicode=true&characterEncoding=utf8&useSSL=true
username=root
#写自己的mysql root用户密码
password=123456
# 初始化数据池拥有的连接数量
initialSize=10
#池中最多可容纳的活着的连接数量，当达到这个数量不在创建连接
maxActive=20
# 最大空闲等待，也就是连接等待队列超过这个值会自动回收未使用的连接，直到达到20
maxIdle=20
#最小空闲等待 ,数据池中最少保持的连接
minIdle=5
#// 最大等待时间，超过这个时间等待队列中的连接就会失效
maxWait=60000
#JDBC驱动建立连接时附带的连接属性，属性的格式必须为[属性名=property;]
#注意："user"与"password"两个属性会被明确传递，因此这里不需要包含他们
connectionPropertier=useUnicode=true&characterEncoding=UTF8
# 设置是否自动提交,默认为
defaultAutoCommit=true
#是否为只读 默认为false
defaultReadOnly=false
# 设置数据库的事务隔离级别默认为1 
defaultTransactionIsolation= READ_UNCOMMITTED
```

### ConnectionFactory类

```JAVA
private  static DataSource dataSource=null;
static
{
    try
    {
        InputStream in = ConnectionFactory.class.getClassLoader().getResourceAsStream("dbcpconfig.properties");
        System.out.println(in==null);
        System.out.println(in);
        Properties pror = new Properties();
        pror.load(in);
        dataSource = BasicDataSourceFactory.createDataSource(pror);
    } catch (Exception e)
    {
        e.printStackTrace();
    }
}

private ConnectionFactory()
{

}
//连接数据库
public static Connection getConnection() throws SQLException {
    return  dataSource.getConnection();

}
//关闭连接
public static void closeResourse(ResultSet rs,
        PreparedStatement pstm, Connection conn)
{
    try
    {
        if (rs != null)
        {
            rs.close();
        }
        if (pstm != null)
        {
            pstm.close();
        }
        if (conn != null)
        {
            conn.close();
        }
    } catch (Exception e)
    {
        e.printStackTrace();}}
```

### 测试 CommonDao类

```java
public static void main(String[] args)
{
 PreparedStatement psmt = null;
 ResultSet rs = null;
 Connection conn = null;
 try {
 String sql = "INSERT INTO  school.student (id, name, age) VALUE (?,?,?)";

 conn = ConnectionFactory.getConnection();
 psmt = conn.prepareStatement(sql);

 psmt.setInt(1,5);
 psmt.setString(2,"zhangsan");
 psmt.setInt(3,50);

 int i = psmt.executeUpdate();
    if (i>0){
        System.out.println("success");
    }
    else {
        System.out.println("error");}} 
 catch (SQLException e){
     e.printStackTrace();}
 finally {
     ConnectionFactory.closeResourse(rs, psmt, conn); }}
```

## c3p0

### 需要的jar包

1. com.mchange 0.9.5.5

   ```xml
   <dependency>
       <groupId>com.mchange</groupId>
       <artifactId>c3p0</artifactId>
       <version>0.9.5.5</version>
   </dependency>
   ```

2. mchange-commons 0.2.19

   ```xml
   <dependency>
       <groupId>com.mchange</groupId>
       <artifactId>mchange-commons-java</artifactId>
       <version>0.2.19</version>
   </dependency>
   ```

### 新建c3p0-config.xml文件

```XML
<?xml version="1.0" encoding="UTF-8"?>

<c3p0-config>
    <default-config>
        <property name="driverClass">com.mysql.jdbc.Driver</property>
        <property name="jdbcUrl">jdbc:mysql://localhost:3306/school</property>
        <property name="user">root</property>
        <property name="password">123456</property>
        <property name="acquireIncrement">5</property>
        <property name="initialPoolSize">10</property>
        <property name="minPoolSize">5</property>
        <property name="maxPoolSize">20</property> <!-- intergalactoApp adopts a different approach to configuring statement
			caching -->
        <property name="maxStatements">0</property>
        <property name="maxStatementsPerConnection">5</property> <!-- he's important, but there's only one of him -->
    </default-config>

    <named-config name="MySQL">
        <property name="driverClass">com.mysql.jdbc.Driver</property>
        <property name="jdbcUrl">jdbc:mysql://localhost:3306/school</property>
        <property name="user">root</property>
        <property name="password">123456</property>

        <property name="acquireIncrement">5</property>
        <property name="initialPoolSize">10</property>
        <property name="minPoolSize">5</property>
        <property name="maxPoolSize">20</property> <!-- intergalactoApp adopts a different approach to configuring statement
			caching -->
        <property name="maxStatements">0</property>
        <property name="maxStatementsPerConnection">5</property> <!-- he's important, but there's only one of him -->
    </named-config>
</c3p0-config>
```

### ConnectionFactory类

```java
private  static DataSource dataSource=null;
static{
try
{
    dataSource = new ComboPooledDataSource("MySQL");
} catch (Exception e)
{
    e.printStackTrace();    }}
private ConnectionFactory(){}
//连接数据库
public static Connection getConnection() throws SQLException {
    return  dataSource.getConnection();}
//关闭连接
public static void closeResourse(ResultSet rs,
        PreparedStatement pstm, Connection conn){
try
{
    if (rs != null)
    {
        rs.close();
    }
    if (pstm != null)
    {
        pstm.close();
    }
    if (conn != null)
    {
        conn.close();
    }
} catch (Exception e)
{
    e.printStackTrace();}}
```

### 测试 CommonDao类

```java
 public static void main(String[] args){
 PreparedStatement psmt = null;
 ResultSet rs = null;
 Connection conn = null;

 try {
     String sql = "INSERT INTO  school.student (id, name, age) VALUE (?,?,?)";

     conn = ConnectionFactory.getConnection();
     psmt = conn.prepareStatement(sql);

     psmt.setInt(1,7);
     psmt.setString(2,"zhangsan");
     psmt.setInt(3,50);

     int i = psmt.executeUpdate();
        if (i>0){
            System.out.println("success");
        }
        else {
            System.out.println("error");
        }
 } catch (SQLException e)
 {
     e.printStackTrace();
 }
 finally {

     ConnectionFactory.closeResourse(rs, psmt, conn);
 } }
```

## 注意

+ c3p0-config.xml文件、dbcpconfig.properties文件 eclipse放在src的根目录下，idea放在resources目录下即可。
