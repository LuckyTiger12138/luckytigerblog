---
title: MybatisPlus 常用写法
date: 2024-05-29 15:19:27
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202405291548316.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["MybatisPlus","数据库","框架"]
categories: ["框架"]
---



# maven配置

```xml
<!--mybatis-plus-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.5</version>
</dependency>
<!-- 连表查询依赖	-->
<dependency>
    <groupId>com.github.yulichang</groupId>
    <artifactId>mybatis-plus-join-boot-starter</artifactId>
    <version>1.4.6</version>
</dependency>
<!-- 连表查询依赖	-->
<dependency>
    <groupId>com.github.yulichang</groupId>
    <artifactId>mybatis-plus-join-annotation</artifactId>
    <version>1.4.6</version>
</dependency>
```

# 新增

```java
    // 直接保存
        sysuserService.save(sysuser);
    // 根据是否有主键id更新或保存
    sysuserService.saveOrUpdate(sysuser);
    // 批量保存
    sysuserService.saveBatch(new ArrayList<Sysuser>());
```



# 删除

```java
    // 根据id删除
    sysuserService.removeById(sysuser);
    // 自定义根据条件删除
    sysuserService.remove(new LambdaQueryWrapper<Sysuser>()
            .eq(Sysuser::getId, sysuser.getId())
            .or()
            .eq(Sysuser::getMark, sysuser.getMark()));
```



# 更新

```java
	// 根据是否有主键id更新
    sysuserService.updateById(sysuser);
    // 自定义根据条件更新
    sysuserService.update(Wrappers.<Sysuser>lambdaUpdate()
            .set(Sysuser::getDelstatus, sysuser.getDelstatus())
            .eq(Sysuser::getId, sysuser.getId()));
    // 批量更新
    sysuserService.updateBatchById(new ArrayList<Sysuser>());
```



# 查询

```java
	// 根据id查找
    Sysuser user = sysuserService.getById(sysuser.getId());
    // 根据条件查询
    Sysuser user1 = sysuserService.getOne(new LambdaQueryWrapper<Sysuser>()
            .eq(Sysuser::getUname, sysuser.getUname())
            .eq(StringUtils.isNotBlank(upass),Sysuser::getUpass, upass) //判断密码是否为空
            .eq(Sysuser::getType, "会员")
    );
    // 关联查询
    Sysuser user2 = sysuserService.getOne(new MPJLambdaWrapper<Sysuser>()
            .eq(Sysuser::getUname, sysuser.getUname())
            .eq(Sysuser::getUpass, upass)
            .eq(Sysuser::getType, "会员")
            .leftJoin(Car.class, Car::getId, Sysuser::getId)
            .selectAll(Car.class)
            .selectAs(Car::getId, Sysuser::getUname)
            .selectAs(Car::getId, "carId")
    );
    // 查多个
    List<Sysuser> 会员 = sysuserService.list(new LambdaQueryWrapper<Sysuser>()
            .eq(Sysuser::getUname, sysuser.getUname())
            .eq(Sysuser::getUpass, upass)
            .eq(Sysuser::getType, "会员")
    );
    // 分页查多个
    Page<Sysuser> 会员1 = sysuserService.page(new Page<>(1, 10), new LambdaQueryWrapper<Sysuser>()
            .eq(Sysuser::getUname, sysuser.getUname())
            .eq(Sysuser::getUpass, upass)
            .eq(Sysuser::getType, "会员"));
```



