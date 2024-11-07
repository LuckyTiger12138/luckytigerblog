---
layout: posts
title: 分组后group_concat如何取到对应位置的数据
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202405221035280.jpg
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
date: 2023-12-23 09:46:57
tags: ["SQL","Mysql"]
categories: ["SQL"]

---

# LOCATE 函数

用于查找字符串中某一字符串的位置。语法格式为：

```sql
LOCATE(substr,str)
LOCATE('world','hello,world')  //7
```

# LEFT函数

用于从字符串左侧开始截取指定长度的字符串

```sql
LEFT(str,len)
LEFT('hello',2)  // 'he'
```

# LENGTH函数

用于获取字符串长度

```sql
LENGTH(str)
LENGTH('hello') //5
```

# REPLACE函数

用于替换字符串中某一部分

```sql
REPLACE(str,old_str,new_str)
REPLACE('hello','o','w') //hellw
```

# 自定义函数str_split_int05

主要用于获取例如‘5;7;3’，这种使用某一个字符分割的字符串指定位置的数据，创建如下：

```sql
CREATE DEFINER=`skip-grants user`@`skip-grants host` FUNCTION `str_split_int05`(
        in_num INT,
        in_rew_str_get BLOB,
        in_separt CHAR(32)
        ) RETURNS char(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
        DECLARE rew_str LONG DEFAULT 0;
        

        IF in_num >= 0 THEN
        SET rew_str = SUBSTRING_INDEX(SUBSTRING_INDEX(in_rew_str_get,in_separt,in_num),in_separt,-1);
        END IF;
        IF in_num < 0 THEN
        SET rew_str = SUBSTRING_INDEX(SUBSTRING_INDEX(in_rew_str_get,in_separt,in_num),in_separt,1);
        END IF;

        RETURN rew_str;
        END
```

使用如下：

index 传正数为从左数第几个，传负数为右数第几个

```sql
str_split_int05(index,str,char)
select str_split_int05(2,'5;7;8;1;9',';')
from dual // 7
select str_split_int05(-2,'5;7;8;1;9',';')
from dual //1
```



# group后怎么对两个group_concat取的数据取到对应位置的数据

## 准备测试数据

```sql
create table text
(
    id         int auto_increment
        primary key,
    name       varchar(255) null,
    score      varchar(500) null,
    start_time varchar(255) null
);
INSERT INTO text (id, name, score, start_time) VALUES (1, '曹天昊', '75', '2023-05-05');
INSERT INTO text (id, name, score, start_time) VALUES (2, '曹天昊', '65', '2023-05-06');
INSERT INTO text (id, name, score, start_time) VALUES (3, '郝晨璐', '74', '2023-05-05');
INSERT INTO text (id, name, score, start_time) VALUES (4, '郝晨璐', '85', '2023-05-06');
INSERT INTO text (id, name, score, start_time) VALUES (5, '蒋淑君', '44', '2023-05-05');
INSERT INTO text (id, name, score, start_time) VALUES (6, '曹天昊', '85', '2023-05-07');
```

## 思路

1.使用LOCATE函数先查出 郝晨璐 在name 中位置

2.使用LEFT函数截取左侧字符

3.截取的字符串长度-去除掉, 的长度为实际下标

4.使用str_split_int05 获取指定位置

```sql

select name,score
     ,locate('郝晨璐',name) `index`
     ,left(name,locate('郝晨璐',name)) `str`
    ,length(left(name,locate('郝晨璐',name)))
    -length(replace(left(name,locate('郝晨璐',name)),',','')) `index2`
from (
         select group_concat(name) name,
                group_concat(score) score
         from (
                  select * from text order by name desc
              )ta
         group by start_time
         ) tb
where find_in_set('郝晨璐',name)
```

## 注意str_split_int05 的index 下标从开始，所以需要加


```sql

select name,score,str_split_int05(index2+1,score,',')sc
from (

         select name,score
              ,locate('郝晨璐',name) `index`
              ,left(name,locate('郝晨璐',name)) `str`
              ,length(left(name,locate('郝晨璐',name)))
             -length(replace(left(name,locate('郝晨璐',name)),',','')) `index2`
         from (
                  select group_concat(name) name,
                         group_concat(score) score
                  from (
                           select * from text order by name desc
                       )ta
                  group by start_time
              ) tb
         where find_in_set('郝晨璐',name)
         ) tbb
```

