---
title: Java-Tree多种操作(递归)
date: 2021-08-22 10:59:39
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311121951980.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["Java","Tree","MyBatis","递归"]
categories: ["Java","Mybatis"]
---



# Mybatis 直接返回tree结构

## 实体类环境搭建

```java
@Data
public class MyCloudDisk implements Serializable {
    /**
     * ID
     */
    private String id;

    /**
     * 名称
     */
    private String name;

    /**
     * 上级父ID
     */
    private String pid;
}
```

```java
@Data
public class MyCloudDiskTypeCustom extends MyCloudDisk {

    private Integer depth;
    private List<MyCloudDiskTypeCustom> children;
}
```

## 获取数据

**注意：要两个select标签都是这一个resultmap，第一个是查找根节点，第二个是递归查找节点 **

### 通过传入根节点的id查询下属子节点

```xml
 <!-- start 根据子id查父类文件夹 -->
    <select id="selectByPid" resultMap="recursionFolderTypeMap">
         SELECT * FROM my_cloud_disk
         WHERE   pid = #{id} 
</select>

    <!-- start 根据子id查子类文件夹 -->
    <select id="findFolderByParentId" resultMap="recursionFolderTypeMap">
    SELECT * FROM my_cloud_disk WHERE pid = #{id}
</select>


    <resultMap id="recursionFolderTypeMap" type="MyCloudDiskTypeCustom">
        <id column="id" jdbcType="VARCHAR" property="id" />
        <result column="name" jdbcType="VARCHAR" property="name" />
        <result column="pid" jdbcType="VARCHAR" property="pid" />
        <collection property="children" ofType="MyCloudDiskTypeCustom"
                    column="id" select="findFolderByParentId">
        </collection>
    </resultMap>
```

### 通过传入子节点的id查询上级父类节点

```xml
 <!-- start 根据子id查子类文件夹 -->
    <select id="findAllRecursion" resultMap="recursionNewsTypeMap">
         SELECT * FROM my_cloud_disk
         WHERE   id = #{id}
        ORDER BY `CREATE_TIME_` desc
</select>
    <!-- start 根据子id查父类文件夹 -->
    <select id="findNewsByParentId" resultMap="recursionNewsTypeMap">
    SELECT * FROM my_cloud_disk WHERE id = #{pid} ORDER BY `CREATE_TIME_` desc
</select>

    <resultMap id="recursionNewsTypeMap" type="MyCloudDiskTypeCustom">
        <id column="id" jdbcType="VARCHAR" property="id" />
        <result column="name" jdbcType="VARCHAR" property="name" />
        <result column="pid" jdbcType="VARCHAR" property="pid" />
        <collection property="children" ofType="MyCloudDiskTypeCustom"
                    column="pid" select="findNewsByParentId">
        </collection>
    </resultMap>
```

# Java

## tree转list

```java
 /**
     * tree转list
     * @param messageList
     * @return
     */
    private List<MyCloudDiskTypeCustom> treeToList(List<MyCloudDiskTypeCustom> messageList) {
        List<MyCloudDiskTypeCustom> result = new ArrayList<>();
        for (MyCloudDiskTypeCustom entity : messageList) {
            result.add(entity);
            List<MyCloudDiskTypeCustom> childMsg = entity.getChildren();
            if (childMsg != null && childMsg.size() > 0) {
                List<MyCloudDiskTypeCustom> entityList = this.treeToList(childMsg);
                result.addAll(entityList);
            }
        }
        if (result.size() > 0) {
            for (MyCloudDiskTypeCustom entity : result) {
                entity.setChildren(null);
            }
        }
        return result;
    }

```

## list 转 tree

```java

    /**
     * list 转 tree
     * @param msgEntity
     * @param allList
     * @return
     */
    private List<MyCloudDiskTypeCustom> messageListToTree(MyCloudDiskTypeCustom msgEntity, List<MyCloudDiskTypeCustom> allList) {
        List<MyCloudDiskTypeCustom> msgList = new ArrayList<>();
        for (MyCloudDiskTypeCustom messageEntity : allList) {
            if (messageEntity.getPid().equals(msgEntity.getId())) {
                if (msgEntity.getChildren() == null) {
                    msgEntity.setChildren(new ArrayList<>());
                }
                msgEntity.getChildren().add(findChild(messageEntity, allList));
            }
        }
        msgList.add(msgEntity);
        return msgList;
    }
    private MyCloudDiskTypeCustom findChild(MyCloudDiskTypeCustom messageEntity, List<MyCloudDiskTypeCustom> allList) {
        for (MyCloudDiskTypeCustom entity : allList) {
            if (entity.getPid().equals(messageEntity.getId())) {
                if (messageEntity.getChildren() == null) {
                    messageEntity.setChildren(new ArrayList<>());
                }
                messageEntity.getChildren().add(findChild(entity, allList));
            }
        }
        return messageEntity;
    }
```

## tree 加层级Depth

```java
  /**
     *  tree 加层级Depth
     * @param messageList
     * @param level
     * @return
     */
    private List<MyCloudDiskTypeCustom> treeSetDepth(List<MyCloudDiskTypeCustom> messageList ,Integer level) {
        // 子节点

        List<MyCloudDiskTypeCustom> childList = new ArrayList<>();
        for (MyCloudDiskTypeCustom entity : messageList) {
            entity.setDepth(level);
            if (entity.getChildren()!=null)
            {
                childList.add(entity);
            }

        }
        for (MyCloudDiskTypeCustom bean : childList) {
            if (bean.getChildren()!=null)
            {
              this.treeSetDepth(bean.getChildren(),level+1);
            }
        }

        return childList;
    }
```

