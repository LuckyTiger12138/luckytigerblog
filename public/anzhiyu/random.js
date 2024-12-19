var posts=["2021/03/28/Echarts-树形关系图/","2021/08/23/IntelliJ-IDEA-开启很慢，运行不流畅，大项目卡顿？一招配置解决/","2021/08/22/Java-Tree-递归/","2020/07/03/MyBatis动态SQL/","2020/07/01/MyBatis增删改查/","2020/07/05/MyBatis缓存/","2020/06/29/MySQL-如何设计数据库/","2020/06/30/MySQL-数据库连接池/","2020/06/29/MySQL事务和索引/","2020/06/29/MySQL函数/","2021/08/17/MybatisPlus-lambdaQueryWrapper条件构造图介绍/","2020/07/02/Mybatis一对多和多对一处理/","2020/07/02/Mybatis分页/","2020/07/02/Mybatis映射/","2020/07/02/Mybatis注解开发/","2020/06/26/Ngrok-内网穿透/","2020/07/09/Spring-Aop/","2020/07/05/Spring-依赖注入（DI）/","2020/07/09/Spring-声明式事务/","2020/07/05/Spring-快速上手/","2020/07/09/Spring-整合MyBatis/","2020/07/06/Spring-注解开发/","2020/07/06/Spring-自动装配/","2020/07/24/SpringMVC-Ajax研究/","2020/07/13/SpringMVC-Json交互处理/","2020/07/13/SpringMVC-RestFul和控制器/","2020/07/09/SpringMVC-什么是SpringMVC/","2020/07/24/SpringMVC-拦截器-文件上传下载/","2020/07/13/SpringMVC-数据处理及跳转/","2020/07/13/SpringMVC-整合SSM框架/","2020/07/09/SpringMVC-第一个MVC程序/","2020/08/06/Springboot-02-yaml配置注入ecurity/","2020/08/06/Springboot-01-原理初探/","2020/08/06/Springboot-03-JSR303数据校验及多环境切换/","2020/08/06/Springboot-04-自动配置原理/","2020/08/06/Springboot-05-自定义starter/","2020/08/06/Springboot-06-整合JDBC/","2020/08/06/Springboot-07-整合Druid/","2020/08/06/Springboot-08-整合MyBatis/","2020/08/06/Springboot-09-Web开发静态资源处理/","2020/08/07/Springboot-10-Thymeleaf模板引擎/","2020/08/07/Springboot-11-MVC自动配置原理/","2020/08/07/Springboot-12-页面国际化/","2020/08/07/Springboot-13-集成Swagger终极版/","2020/08/07/Springboot-14-异步、定时、邮件任务/","2020/08/07/Springboot-15-富文本编辑器/","2020/08/07/Springboot-16-Dubbo和Zookeeper集成/","2020/08/07/Springboot-17-集成SpringSecurity/","2020/08/10/Springboot-18-Shiro/","2020/07/05/Spring概述及IOC理论推导/","2020/06/28/mysql安装/","2023/11/28/wsl报错/","2024/05/29/MybatisPlus-常用写法/","2023/12/23/group_concat如何取到对应位置的数据/","2024/08/13/linux下使用Docker部署nginx/","2024/08/13/shell脚本启动jar/","2024/08/14/mkcert自签SSL证书/","2024/09/03/Element-tooltip自定义样式/","2024/12/19/开发常用bat脚本/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };var friend_link_list=[{"name":"Hexo","link":"https://hexo.io/zh-tw/","avatar":"https://d33wubrfki0l68.cloudfront.net/6657ba50e702d84afb32fe846bed54fba1a77add/827ae/logo.svg","descr":"快速、简单且强大的网站框架"},{"name":"anzhiyu主题","link":"https://blog.anheyu.com/","avatar":"https://npm.elemecdn.com/anzhiyu-blog-static@1.0.4/img/avatar.jpg","descr":"生活明朗，万物可爱","siteshot":"https://npm.elemecdn.com/anzhiyu-theme-static@1.1.6/img/blog.anheyu.com.jpg"},{"name":"安知鱼","link":"https://blog.anheyu.com/","avatar":"https://npm.elemecdn.com/anzhiyu-blog-static@1.0.4/img/avatar.jpg","descr":"生活明朗，万物可爱","siteshot":"https://npm.elemecdn.com/anzhiyu-theme-static@1.1.6/img/blog.anheyu.com.jpg","color":"vip","tag":"技术"},{"name":"SerMs","link":"https://blog.serms.top/","avatar":"https://bu.dusays.com/2023/10/11/65269ea6226c8.png","descr":"代码如诗，细节成就极致，逻辑成就完美。","siteshot":"https://bu.dusays.com/2023/10/11/65264d86ddebb.png","tag":"技术"},{"name":"夜雨柠檬","link":"https://blog.yeyulemon.top/","avatar":"https://imgbed.yeyulemon.top/uploads/652404e068dd8.png","descr":"生于忧患，死于安乐。","siteshot":"https://imgbed.yeyulemon.top/uploads/6524bbe719a3a.png","tag":"技术"},{"name":"dzbook","link":"https://dzbook.top/","avatar":"https://dzbook.top/upload/5b7d33fa-efba-4d33-82d0-0c80e18f3ccc.png","descr":"时长两年半全栈菜鸡。","siteshot":"https://cdn.jsdelivr.net/gh/LuckyTiger12138/images//img/202405221017957.png","tag":"技术"},{"name":"安知鱼","link":"https://blog.anheyu.com/","avatar":"https://npm.elemecdn.com/anzhiyu-blog-static@1.0.4/img/avatar.jpg","descr":"生活明朗，万物可爱","recommend":true},{"name":"白雾茫茫丶","link":"https://blog.xmwpro.com/","avatar":"https://cyan-blog.oss-cn-shenzhen.aliyuncs.com/global/avatar.jpg","descr":"记录学习、生活和有趣的事"}];
    var refreshNum = 1;
    function friendChainRandomTransmission() {
      const randomIndex = Math.floor(Math.random() * friend_link_list.length);
      const { name, link } = friend_link_list.splice(randomIndex, 1)[0];
      Snackbar.show({
        text:
          "点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「" + name + "」",
        duration: 8000,
        pos: "top-center",
        actionText: "前往",
        onActionClick: function (element) {
          element.style.opacity = 0;
          window.open(link, "_blank");
        },
      });
    }
    function addFriendLinksInFooter() {
      var footerRandomFriendsBtn = document.getElementById("footer-random-friends-btn");
      if(!footerRandomFriendsBtn) return;
      footerRandomFriendsBtn.style.opacity = "0.2";
      footerRandomFriendsBtn.style.transitionDuration = "0.3s";
      footerRandomFriendsBtn.style.transform = "rotate(" + 360 * refreshNum++ + "deg)";
      const finalLinkList = [];
  
      let count = 0;

      while (friend_link_list.length && count < 3) {
        const randomIndex = Math.floor(Math.random() * friend_link_list.length);
        const { name, link, avatar } = friend_link_list.splice(randomIndex, 1)[0];
  
        finalLinkList.push({
          name,
          link,
          avatar,
        });
        count++;
      }
  
      let html = finalLinkList
        .map(({ name, link }) => {
          const returnInfo = "<a class='footer-item' href='" + link + "' target='_blank' rel='noopener nofollow'>" + name + "</a>"
          return returnInfo;
        })
        .join("");
  
      html += "<a class='footer-item' href='/link/'>更多</a>";

      document.getElementById("friend-links-in-footer").innerHTML = html;

      setTimeout(()=>{
        footerRandomFriendsBtn.style.opacity = "1";
      }, 300)
    };