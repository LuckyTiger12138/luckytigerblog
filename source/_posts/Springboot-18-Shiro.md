---
title: Springboot-18 Shiro
date: 2020-08-10 09:26:46
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311102341308.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["springboot","框架","shiro","安全式"]
categories: ["框架"]
---

# RBAC简介

RBAC（Role-Based Access Control，基于角色的访问控制），就是用户通过角色与权限进行关联。简单地说，一个用户拥有若干角色，每一个角色拥有若干权限。这样，就构造成“用户-角色-权限”的授权模型。在这种模型中，用户与角色之间，角色与权限之间，一般者是多对多的关系。

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images/img/20200810092846.jpg)

角色是什么？可以理解为一定数量的权限的集合，权限的载体。例如：一个论坛系统，“超级管理员”、“版主”都是角色。版主可管理版内的帖子、可管理版内的用户等，这些是权限。要给某个用户授予这些权限，不需要直接将权限授予用户，可将“版主”这个角色赋予该用户。

在应用系统中，权限表现成什么？对功能模块的操作，对上传文件的删改，菜单的访问，甚至页面上某个按钮、某个图片的可见性控制，都可属于权限的范畴。有些权限设计，会把功能操作作为一类，而把文件、菜单、页面元素等作为另一类，这样构成“用户-角色-权限-资源”的授权模型。而在做数据表建模时，可把功能操作和资源统一管理，也就是都直接与权限表进行关联，这样可能更具便捷性和易扩展性。



例如:  

+ 公司有总经理职位、部门经理职位、普通员工职位,

+ 总经理事无巨细都有获知，更改的权利，部门经理只能管理本部门的相关事宜，普通员工就负责干好自己的活。

我们可以给张三授予总经理的职位(角色)，从而使张三可以操作anything。

可以给李四授予财务经理的职位(角色)，从而使李四能够查看、操作所有的财务报表。

上例中，查看财务报表，删除财务报表可以理解为权限，财务经理可以理解为角色。









# Shiro简介

 	Apache Shiro 是 Java 的一个安全框架。目前，使用 Apache Shiro 的人越来越多，因为它相当简单，对比      Spring Security，可能没有 Spring Security  做的功能强大，但是在实际工作时可能并不需要那么复杂的东西，所以使用小而简单的 Shiro  就足够了。对于它俩到底哪个好，这个不必纠结，能更简单的解决项目问题就好了。

　　Shiro 可以非常容易的开发出足够好的应用，其不仅可以用在 JavaSE 环境，也可以用在JavaEE 环境。Shiro 可以帮助我们完成：认证、授权、加密、会话管理、与 Web 集成、缓存等。 Shiro 的 API  也是非常简单；其基本功能点如下图所示：

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images/img/20200810092903.png)

==**Authentication**== ：身份认证/登录，验证用户是不是拥有相应的身份；

==**Authorization**==：   授权，即权限验证，验证某个已认证的用户是否拥有某个权限；即判断用户是否能做事情，常见的如：验证某个用户是否拥有某个角色。或者细粒度的验证某个用户对某个资源是否具有某个权限；

**Session Manager**：会话管理，即用户登录后就是一次会话，在没有退出之前，它的所有信息都在会话中；会话可以是普通 JavaSE 环境的，也可以是如 Web 环境的；

**Web Support** ： Web 支持，可以非常容易的集成到 Web 环境；

**Caching**：  缓存，比如用户登录后，其用户信息、拥有的角色/权限不必每次去查，这样可以提高效率；

**Concurrency** ：shiro 支持多线程应用的并发验证，即如在一个线程中开启另一个线程，能把权限自动传播过去；

**Testing** ：提供测试支持；

**Run As** ：允许一个用户假装为另一个用户（如果他们允许）的身份进行访问；

**Remember Me**：记住我，这个是非常常见的功能，即一次登录后，下次再来的话不用登录了。

**记住一点，Shiro  不会去维护用户、维护权限；这些需要我们 自己去 设计/ 提供 ； 然后通过相应的 接口注入给 给 Shiro  即可。**

　　接下来我们分别从外部和内部来看看 Shiro 的架构，对于一个好的框架，从外部来看应该具有非常简单易于使用的 API，且 API 契约明确；从内部来看的话，其应该有一个可扩展的架构，即非常容易插入用户自定义实现，因为任何框架都不能满足所有需求。
首先，我们从外部来看 Shiro 吧，即从应用程序角度的来观察如何使用 Shiro 完成工作。如下图：

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images/img/20200810130728.png)
可以看到：应用代码直接交互的对象是**Subject**，也就是说Shiro的对外API核心就是Subject；其每个 API 的含义：
==**Subject**==：  主体，代表了当前“用户”，这个用户不一定是一个具体的人，与当前应用交互的任何东西都是  Subject，如网络爬虫，机器人等；即一个抽象概念；所有 Subject 都绑定到 SecurityManager，与Subject  的所有交互都会委托给 SecurityManager；可以把 Subject 认为是一个门面；SecurityManager 才是实际的执行者；

==**SecurityManager**==  ：安全管理器；即所有与安全有关的操作都会与 SecurityManager 交互；且它管理着所有 Subject；可以看出它是 Shiro  的核心，它负责与后边介绍的其他组件进行交互，如果学习过SpringMVC，你可以把它看成 DispatcherServlet  前端控制器；

==**Realm**==：   域，Shiro 从 Realm 获取安全数据（如用户、角色、权限），就是说  SecurityManager要验证用户身份，那么它需要从 Realm 获取相应的用户进行比较以确定用户身份是否合法；也需要从 Realm  得到用户相应的角色/权限进行验证用户是否能进行操作；可以把 Realm 看成 DataSource，即安全数据源。

也就是说对于我们而言，最简单的一个 Shiro 应用：
1、 应用代码通过 Subject 来进行认证和授权，而 Subject 又委托给 SecurityManager；
2、 我们需要给 Shiro 的 SecurityManager 注入 Realm，从而让 SecurityManager 能得到合法的用户及其权限进行判断。
从以上也可以看出， Shiro 不提供维护用户/ 权限， 而是通过 Realm  让开发人员自己注入。

 



**身份认证**

	身份验证，即在应用中谁能证明他就是他本人。一般提供如他们的身份 ID 一些标识信息来表明他就是他本人，如提供身份证，用户名/密码来证明。
	在 shiro 中，用户需要提供 principals （身份）和 credentials（证明）给 shiro，从而应用能验证用户身份：

==**principals**==：身份，即主体的标识属性，可以是任何东西，如用户名、邮箱等，唯一即可。一个主体可以有多个    principals，但只有一个 Primary principals，一般是用户名/密码/手机号。

==**credentials**==：证明/凭证，即只有主体知道的安全值，如密码/数字证书等。最常见的 principals 和 credentials 组合就是用户名/密码了。接下来先进行一个基本的身份认证。





# SpringBoot与Shiro集成

### 登陆流程分析

在控制器中，获取到用户名、密码。 把用户名、密码封装成一个UsernamePasswordToken,  然后调用Subject.login(token)方法;
Subject.login(token);  背后，会首先调用Realm 中的 doGetAuthenticationInfo()方法进行登陆验证，根据原始令牌中的用户名，从数据库查询用户，如果没查到，Subject.login()方法就抛出一个UnKnownAccountException.如果查到了，那么就把查到的用户，查到的密码，封装成一个SimpleAuthenticationInfo，传递到 MyCredentialsMatcher 的 doCredentialsMatch()内，然后进行密码匹配。
doCredentialsMatch()方法内有两个参数，一个是Controller中的原始令牌，一个是Realm中传过来的SimpleAuthenticationInfo，从原始令牌中获取密码，并且加密，然后从 SimpleAuthenticationInfo取出数据库查到的密码， 把两个密码进行匹配，
如果密码不一致，此方法返回false，那么controller中就会出现 IncorrectCredentialsException异常，如果密码一致，就返回true，就意味着登陆成功了。

退出登录：Subject.logout()

### 加密算法



```java
  public static void main(String[] args) {
        //使用用户名作为盐，迭代3次，对密码进行加密
        Md5Hash hs = new Md5Hash("123","ls",3);
        System.out.println(hs.toString());
    }
```

https://www.cnblogs.com/oumyye/p/4593592.html

https://www.jianshu.com/p/67e0adf0b677



### 权限验证原理

在系统内，遇到需要验证用户权限的地方时，会去执行自定义Realm中的doGetAuthorizationInfo()方法，得到该用户所具有的所有角色及权限的一个集合，然后看一下集合中是否有这个权限存在。



默认，添加或删除用户的角色 或资源 ，系统不需要重启，但是需要用户重新登录。

即用户的授权是首次登录后第一次访问需要权限页面时进行加载。

但是需要进行控制的权限资源，是在启动时就进行加载，如果要新增一个权限资源需要重启系统。





在系统内，可以使用如下权限验证模式：

#### 注解式

```java
@RequiresPermissions("权限管理")
@RequestMapping("/auth/list")
public String authList(){
    return "admin-auth";
}
```

**@RequiresAuthentication**  验证用户是否登录，等同于方法subject.isAuthenticated() 结果为true时。



**@RequiresUser** 验证用户是否被记忆，user有两种含义：

​	一种是成功登录的（subject.isAuthenticated() 结果为true）；

​	另外一种是被记忆的（ subject.isRemembered()结果为true）。

**@RequiresGuest**  验证是否是一个guest的请求，与@ RequiresUser完全相反。

 	换言之，RequiresUser  == ! RequiresGuest 。

​	此时subject.getPrincipal() 结果为null.



**@RequiresRoles** 例如：@RequiresRoles("aRoleName");

  void someMethod();

如果subject中有aRoleName角色才可以访问方法someMethod。如果没有这个权限则会抛出异常[AuthorizationException](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/authz/AuthorizationException.html)。



**@RequiresPermissions**  例如： @RequiresPermissions( {"file:read", "write:aFile.txt"} )
   void someMethod();

要求subject中必须同时含有file:read和write:aFile.txt的权限才能执行方法someMethod()。否则抛出异常[AuthorizationException](http://shiro.apache.org/static/current/apidocs/org/apache/shiro/authz/AuthorizationException.html)。



#### 编程式

```java
Subject currentUser = SecurityUtils.getSubject();  
if (currentUser.hasRole("administrator")) {  
   //拥有角色administrator
} else{  
   //没有角色处理
}  

```



#### 标签式



需要引入thymeleaf-shiro的依赖，并且在html标签添加shiro命名空间

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
</html>
```



| **标签名称**                         | **标签条件（均是显示标签内容）** |
| ------------------------------------ | -------------------------------- |
| <shiro:authenticated >               | 登录之后                         |
| <shiro:notAuthenticated >            | 不在登录状态时                   |
| <shiro:guest >                       | 用户在没有RememberMe时           |
| <shiro:user >                        | 用户在RememberMe时               |
| <shiro:hasAnyRoles name="abc,123" >  | 在有abc或者123角色时             |
| <shiro:hasRole   name="abc">         | 拥有角色abc                      |
| <shiro:lacksRole   name="abc">       | 没有角色abc                      |
| <shiro:hasPermission   name="abc">   | 拥有权限资源abc                  |
| <shiro:lacksPermission   name="abc"> | 没有abc权限资源                  |
| shiro:principal                      | 默认显示用户名称                 |



### 有关shiro的依赖：

```xml
<!-- https://mvnrepository.com/artifact/org.apache.shiro/shiro-core -->
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-core</artifactId>
			<version>1.4.0</version>
		</dependency>

		<!-- https://mvnrepository.com/artifact/org.apache.shiro/shiro-web -->
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-web</artifactId>
			<version>1.4.0</version>
		</dependency>
		<!-- https://mvnrepository.com/artifact/org.apache.shiro/shiro-spring -->
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-spring</artifactId>
			<version>1.4.0</version>
		</dependency>
		<!-- https://mvnrepository.com/artifact/com.github.theborakompanioni/thymeleaf-extras-shiro -->
		<dependency>
			<groupId>com.github.theborakompanioni</groupId>
			<artifactId>thymeleaf-extras-shiro</artifactId>
			<version>2.0.0</version>
		</dependency>
```





### 相关代码:

**ShiroConfig.java**

```java
@Component
public class ShiroConfig {

    @Bean(name = "shiroFilterFactoryBean")
    public ShiroFilterFactoryBean getBean(@Autowired SecurityManager manager){

        System.err.println("----------------shiro 已经加载--------------");

        ShiroFilterFactoryBean bean =
                new ShiroFilterFactoryBean();
        //设定安全管理器
        bean.setSecurityManager(manager);

        bean.setLoginUrl("/login");
        bean.setSuccessUrl("/index");
        Map<String, String> filterChainDefinition = new LinkedHashMap<>();
        filterChainDefinition.put("/login","anon");
        filterChainDefinition.put("/userLogin","anon");
        filterChainDefinition.put("/static/**","anon");
        filterChainDefinition.put("/**","authc");
        filterChainDefinition.put("/*.*","authc");
        bean.setFilterChainDefinitionMap(filterChainDefinition);
        return bean;
    }
    @Bean(name="securityManager")
    public SecurityManager getManager(@Autowired MyRealm myRealm,
                                      @Autowired MyCredentialMatcher myCredentialMatcher){
        myRealm.setCredentialsMatcher(myCredentialMatcher);
        DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
        manager.setRealm(myRealm);
        return manager;
    }
    @Bean
    public ShiroDialect shiroDialect() {
        return new ShiroDialect();
    }

    //以下为开启注解支持功能
    
    @Bean
    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor(){
        return new LifecycleBeanPostProcessor();
    }
    @Bean
    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator(){
        DefaultAdvisorAutoProxyCreator creator=new DefaultAdvisorAutoProxyCreator();
        creator.setProxyTargetClass(true);
        return creator;
    }
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(@Qualifier("securityManager") SecurityManager 	manager) {
        AuthorizationAttributeSourceAdvisor advisor=new AuthorizationAttributeSourceAdvisor();
        advisor.setSecurityManager(manager);
        return advisor;
    }
}

```



+ ***loginUrl*** ： 没有登录的用户请求需要登录的页面时自动跳转到登录页面，不是必须的属性，不输入地址的话会自动寻找项目web项目的根目录下的”/login.jsp”页面。

+ ***successUrl*** ：登录成功默认跳转页面，不配置则跳转至”/”。如果登陆前点击的一个需要登录的页面，则在登录自动跳转到那个需要登录的页面。不跳转到此。

+ ***unauthorizedUrl***：没有权限默认跳转的页面。

+ **anon**:   例子/admins/**=anon没有参数，表示可以匿名使用。

+ **authc**:  例如/admins/user/**=authc表示需要认证(登录)才能使用，没有参数

+ **roles**： 例子/admins/user/** =roles[admin],参数可以写多个，多个时必须加上引号，并且参数之间用逗号分割，当有多个参数时，例如admins/user/**=roles["admin,guest"],每个参数通过才算通过，相当于hasAllRoles()方法。

+ **perms**：例子/admins/user/**  =perms[user:add:],参数可以写多个，多个时必须加上引号，并且参数之间用逗号分割，例如/admins/user/**=perms["user:add:*,user:modify:*"]，当有多个参数时必须每个参数都通过才通过，想当于isPermitedAll()方法。

+ **rest**：例子/admins/user/** =rest[user],根据请求的方法，相当于/admins/user/**=perms[user:method] ,其中method为post，get，delete等。

+ **user**:   例如/admins/user/**=user没有参数表示必须存在用户，当登入操作时不做检查

注：

​		anon，authcBasic，auchc，user是认证过滤器，

​		perms，roles，ssl，rest，port是授权过滤器





**自定义Realm：MyRealm.java**

```java
@Component
public class MyRealm extends AuthorizingRealm {

    @Autowired
    private SysService sysService;

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {

        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        String username = token.getUsername();
        String password = new String(token.getPassword());
        //根据用户名，去查询用户信息，得到用户信息以后，可能会得到一个User对象。
        Sys_User user = sysService.findUserByName(username);
        if (user == null) {
            return null;
        }
        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(user, user.getPassword(), getName());
        return info;
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {

        Sys_User user = (Sys_User) principalCollection.getPrimaryPrincipal();
        List<Sys_Role> roles = sysService.getAllRolesByUser(user.getUsername());
        Set<String> allRoleNames = new HashSet<>();
        for (Sys_Role role : roles) {
            allRoleNames.add(role.getRole_name());
        }

        List<Sys_Auth> auths = sysService.getAllAuthsByUser(user.getUsername());

        Set<String> allAuthNames = new HashSet<>();
        for (Sys_Auth a : auths) {
            allAuthNames.add(a.getAuth_name());
        }

        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        info.addRoles(allRoleNames);
        info.addStringPermissions(allAuthNames);

        return info;
    }
}
```



**密码匹配: MyCredentialMatcher**

```java
@Component
public class MyCredentialMatcher extends SimpleCredentialsMatcher {

    @Override
    public boolean doCredentialsMatch(AuthenticationToken authenticationToken, AuthenticationInfo authenticationInfo) {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;

        //用户输入的
        String pwd1 = new String(token.getPassword());
        String username = token.getUsername();
        Md5Hash hash = new Md5Hash(pwd1,username,3);
        String pwd11 = hash.toString(); // 之后之后的密码

        //从数据库根据用户名取出的密码
        Object pwd2 = authenticationInfo.getCredentials();

        /*System.out.println("原始密码:  "+pwd1);
        System.out.println("数据库取出的: "+pwd2);*/
        return this.equals(pwd11,pwd2);
    }

    public static void main(String[] args) {
        Md5Hash hash = new Md5Hash("123","ls",3);
        String s = hash.toString();
        System.out.println(s);
    }

}

```









菜单遍历核心代码:

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images/img/20200810130739.png)







