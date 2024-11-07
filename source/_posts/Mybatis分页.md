---
title: Mybatis分页
date: 2020-07-02 21:57:31
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311111908018.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["MyBatis","数据库","框架","分页"]
categories: ["框架"]
---

# limit实现分页

## 思考：为什么需要分页？

​		在学习mybatis等持久层框架的时候，会经常对数据进行增删改查操作，使用最多的是对数据库进行查询操作，如果查询大量数据的时候，我们往往使用分页进行查询，也就是每次处理小部分数据，这样对数据库压力就在可控范围内。

## 使用Limit实现分页

```sql
#语法
SELECT * FROM table LIMIT stratIndex，pageSize
 
SELECT * FROM table LIMIT 5,10; // 检索记录行 6-15  
 
#为了检索从某一个偏移量到记录集的结束所有的记录行，可以指定第二个参数为 -1：   
SELECT * FROM table LIMIT 95,-1; // 检索记录行 96-last.  
 
#如果只给定一个参数，它表示返回最大的记录行数目：   
SELECT * FROM table LIMIT 5; //检索前 5 个记录行  
 
#换句话说，LIMIT n 等价于 LIMIT 0,n。 
```

## 步骤：

1. 修改Mapper文件

   ```xml
   <select id="selectUser" parameterType="map" resultType="user">
       select * from user limit #{startIndex},#{pageSize}
   </select>
   ```

2. Mapper接口，参数为map

   ```java
   //选择全部用户实现分页
   List<User> selectUser(Map<String,Integer> map);
   ```

3. 在测试类中传入参数测试

+ 推断：起始位置 =  （当前页面 - 1 ） * 页面大小

  ```java
  //分页查询 , 两个参数startIndex , pageSize
  @Test
  public void testSelectUser() {
      SqlSession session = MybatisUtils.getSession();
      UserMapper mapper = session.getMapper(UserMapper.class);
   
      int currentPage = 1;  //第几页
      int pageSize = 2;  //每页显示几个
      Map<String,Integer> map = new HashMap<String,Integer>();
      map.put("startIndex",(currentPage-1)*pageSize);
      map.put("pageSize",pageSize);
   
      List<User> users = mapper.selectUser(map);
   
      for (User user: users){
          System.out.println(user);
      }
   
      session.close();
  }
  ```

# RowBounds分页

​		我们除了使用Limit在SQL层面实现分页，也可以使用RowBounds在Java代码层面实现分页，当然此种方式作为了解即可。我们来看下如何实现的！

## 步骤：

1. mapper接口

   ```java
   //选择全部用户RowBounds实现分页
   List<User> getUserByRowBounds();
   ```

2. mapper文件

   ```xml
   <select id="getUserByRowBounds" resultType="user">
     select * from user
   </select>
   ```

3. 测试类

   ```java
   @Test
   public void testUserByRowBounds() {
       SqlSession session = MybatisUtils.getSession();
    
       int currentPage = 2;  //第几页
       int pageSize = 2;  //每页显示几个
       RowBounds rowBounds = new RowBounds((currentPage-1)*pageSize,pageSize);
    
       //通过session.**方法进行传递rowBounds，[此种方式现在已经不推荐使用了]
       List<User> users = session.selectList("com.kuang.mapper.UserMapper.getUserByRowBounds", null, rowBounds);
    
       for (User user: users){
           System.out.println(user);
       }
       session.close();
   }
   ```

# 第三方插件

例 PageHelper

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images/img/20200702224044.jpg)
