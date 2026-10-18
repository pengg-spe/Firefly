---
title: 如何彻底解决DNS劫持污染
published: 2026-10-19
tags:
  - dns
category: 互联网技术
---
![](https://i-operation.csdnimg.cn/images/cf31225e169b4512917b2e77694eb0a2.png)DNS污染与劫持：识别与解决方案

最新推荐文章于 2025-09-16 17:34:07 发布

![](https://csdnimg.cn/release/blogv2/dist/pc/img/original.png)

[吾爱白嫖](https://blog.csdn.net/qq_35787254 "吾爱白嫖") ![](https://csdnimg.cn/release/blogv2/dist/pc/img/newCurrentTime2.png) 于 2021-10-10 11:22:22 发布

版权声明：本文为博主原创文章，遵循 [CC 4.0 BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) 版权协议，转载请附上原文出处链接和本声明。

## DNS劫持污染介绍  

DNS污染——指的是用户访问一个地址，国内的服务器(非DNS)监控到用户访问的已经被标记地址时，服务器伪装成DNS服务器向用户发回错误的地址的行为。范例，访问油管、脸书之类网站等出现的状况。  
      你使用一个不存在的 IP （肯定不是 DNS ）作为 DNS 去解析某个域名的时候，理应没有任何返回，但是却能返回一个错误 IP。为了证明是污染不是劫持，你再用这个不存在的 IP 去解析不存在的域名，这个时候你会发现没有任何返回，这就说明这个不存在的域名没有被污染。  
下面就来教你如何验证DNS有无被污染以及污染后的解决方法。

##   
DNS劫持污染验证方法  
[阿里云网站运维检测平台一站式的网站、网络运维工具，可自助诊断域名、dns、网站、备案等建站中常见问题；提供强大的网络拨测工具，通过全球各地探测点对服务做http、ping、dns、路由等拨测，检测网络质量分析服务故障；免费支持查询全球IP地址地理位置，准确靠谱。未来本平台还将为IT从业者提供更多效率工具，敬请期待！![icon-default.png?t=L892](https://i-blog.csdnimg.cn/blog_migrate/dad932ca2c38cf78e5ef19cfc5db654e.png)https://zijian.aliyun.com/detect/ping](https://zijian.aliyun.com/detect/ping "阿里云网站运维检测平台")

使用阿里云的运维检测平台的ping测试，该平台相对站长之家的ping测试的优势是：可以返回不同地区解析的所有ip，而站长之家的ping对于ip地址是：127.0.0.1和0.0.0.0的不会返回，

1. 在ping检测里面输入域名，记住是域名，而不知网址，即不包括Https://这一段以及斜杠
2. ![](https://i-blog.csdnimg.cn/blog_migrate/cb2f9fbc85b043a0f59c729b849f4c34.png)
3. 如图所示，127.0.0.1的即为被运营商劫持了
4. 劫持后，对应的表现为，访问该网址，会秒显示**连接已重置。**  
    ![](https://i-blog.csdnimg.cn/blog_migrate/77a4f3ac07b3d204deb2b91def4d3402.png)

##    
DNS劫持污染解决方法

      1、使用各种SSH加密代理，在加密代理里进行远程DNS解析，或者使用科学的上网。

      2、修改hosts文件，操作系统中Hosts文件的权限优先级高于DNS服务器，操作系统在访问某个域名时，会先检测HOSTS文件，然后再查询DNS服务器。可以在hosts添加受到污染的DNS地址来解决DNS污染和DNS劫持。

      3、通过一些软件编程处理，可以直接忽略返回结果是虚假IP地址的数据包，直接解决DNS污染的问题。

      4、使用DNSCrypt软件，此软件与使用的OpenDNS直接建立相对安全的TCP连接并加密请求数据，从而不会被污染。

      5、**专门新建一个发布页，用来跳转最新的正常的域名或者直接跳转到ip，用ip进行访问，总而言之，域名只是为了方便记忆，终归要解析成ip进行数据传输的！**