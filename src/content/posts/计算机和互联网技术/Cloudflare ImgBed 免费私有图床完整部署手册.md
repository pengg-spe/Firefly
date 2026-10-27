---
title: Cloudflare ImgBed 免费私有图床完整部署手册
published: 2026-10-19
tags:
  - cloudflare
  - 图床
category: 互联网技术
---

## [1 前言：为什么选 Cloudflare ImgBed](#_1-前言为什么选-cloudflare-imgbed)

### [1.1 现有图床痛点](#_11-现有图床痛点)

- 商业对象存储图床：国内 **COS / OSS** 存储、外网流量长期计费，长期维护成本持续上涨
- 第三方公共图床：强制防盗链跨域限制、平台关停、图片永久丢失风险高
- 无全球边缘加速：海外访问加载缓慢，国内访问链路波动，大图加载超时
- 前后端资源分层混乱：图片存储、管理前端、上传接口耦合，扩容迁移成本高

### [1.2 项目优势](#_12-项目优势)

- 依托 **Cloudflare Pages** 静态页面免费托管，无服务器月租支出
- 全球 275+ 边缘接入点 CDN 加速，国内外图片低延迟访问
- 原生兼容 **R2** 对象存储，支持标准 **S3** 协议，可对接第三方对象存储
- 内置可视化管理后台，支持批量上传、预览、删除、一键复制图片链接
- 边缘函数承载上传业务逻辑，全链路 Serverless 架构，无需自建后端服务

### [1.3 适用人群](#_13-适用人群)

- 独立博客、自媒体站长，长期托管文章配图
- Obsidian / Notion / 语雀 笔记工具用户，搭建私有稳定图床
- 前端开发者，静态图标、截图、素材资源托管场景
- 个人小型项目，追求零成本、高可用静态资源存储方案

---

## [2 方案选型对比](#_2-方案选型对比)

### [2.1 两种部署方案约束](#_21-两种部署方案约束)

- Pages 托管前端 + Workers 边缘函数：完整可视化管理面板，元数据持久化方案成熟，上手门槛低
- Workers 纯函数方案：无前端管理页面，仅开放上传、查询接口，适配程序自动化批量调用场景

### [2.2 Pages 部署 / Workers 部署 三线对比表](#_22-pages-部署-workers-部署-三线对比表)

### [2.3 选型结论](#_23-选型结论)

新手、博客站长、笔记工具用户**优先 Pages 方案**，配套可视化管理后台，操作贴合官方文档，开箱即用；仅自动化脚本、批量程序上传场景选择 Workers 纯函数方案。

---

## [3 部署前置准备](#_3-部署前置准备)

### [3.1 GitHub 账号](#_31-github-账号)

用于 Fork 开源 CloudFlare-ImgBed 源码仓库，**Cloudflare Pages** 依赖 Git 仓库实现自动构建、更新部署。

### [3.2 PayPal 账号注册以及绑定银联](#_32-paypal-账号注册以及绑定银联)

> ⚠️ 关键警告：开通 **R2 对象存储** 强制要求绑定支付渠道，仅做身份校验，免费额度范围内不会产生任何扣费，无隐藏消费。

- PayPal 注册地址：[https://www.paypal.com/c2/home](https://www.paypal.com/c2/home)
- 注册 PayPal 个人账户，完成实名认证并绑定国内银联储蓄卡
- 认证完成后再进入 Cloudflare 后台完成支付渠道授权
- 说明：开通 Cloudflare R2 海外存储扣费必须使用**国际版 PayPal**，地区选择「中国」，可绑定银联储蓄卡 / 双币信用卡。

### [3.3 Cloudflare 免费账号](#_33-cloudflare-免费账号)

注册 [Cloudflare](https://dash.cloudflare.com/login) 免费版账号，无需升级 Pro / 企业套餐，免费资源完全满足个人图床业务需求。

### [3.4 绑定 Paypal 支付，开通 R2 对象存储](#_34-绑定-paypal-支付开通-r2-对象存储)

- 进入 Cloudflare 后台侧边栏 **R2** 功能面板
- 根据页面指引绑定已完成银联认证的 PayPal 账户
- 完成支付渠道校验后，开通 R2 对象存储服务，预留存储桶创建入口
- 最后创建一个存储桶，记住这个存储桶的名称，比如 **cloudflare-imgbed**

---

## [4 Cloudflare Pages 分步部署](#_4-cloudflare-pages-分步部署)

### [4.1 Fork 官方 Cloudflare ImgBed 源码仓库](#_41-fork-官方-cloudflare-imgbed-源码仓库)

仓库开源地址：`https://github.com/MarSeventh/CloudFlare-ImgBed` 操作步骤

- 登录 GitHub，访问 [CloudFlare ImgBed 项目](https://github.com/MarSeventh/CloudFlare-ImgBed)
- 页面右上角点击 **Fork**，将完整源码复制至个人 GitHub 名下
- Fork 完成后进入个人仓库，确认源码文件完整拉取无缺失

### [4.2 在 Cloudflare 后台创建 Pages 项目](#_42-在-cloudflare-后台创建-pages-项目)

- 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
- 后台左侧导航栏进入 **Workers & Pages** 功能入口
- 点击「创建应用程序」→「创建 Pages」
- 连接 GitHub 账号，授权 Cloudflare 读取个人 GitHub 仓库权限
- 在仓库列表选中刚刚 Fork 完成的 `cloudflare-imgbed` 仓库

### [4.3 项目构建参数配置](#_43-项目构建参数配置)

### [4.4 首次保存并触发部署](#_44-首次保存并触发部署)

参数填写完成后点击「保存并部署」，Cloudflare 自动拉取仓库代码、安装依赖、打包静态资源，等待 2–5 分钟构建完成，系统自动生成项目默认访问域名。

### [4.5 元数据存储：KV / D1 数据库二选一配置](#_45-元数据存储kv-d1-数据库二选一配置)

> 强制提醒：KV、D1 仅需配置其中一种，无需同时绑定；若当前 Cloudflare 账号已有其他项目占用 KV 命名空间，建议选择 D1；全新账号统一优先 KV。

#### [4.5.1 KV 与 D1 数据库核心差异三线对比表](#_451-kv-与-d1-数据库核心差异三线对比表)

#### [4.5.2 KV 命名空间创建 + Pages 项目绑定完整操作](#_452-kv-命名空间创建-pages-项目绑定完整操作)

- Cloudflare 后台 → Workers & Pages → **KV** 面板
- 点击创建命名空间，自定义名称如 `imgbed-kv`
- 返回 Pages 项目页面 → 设置 → 环境变量与绑定
- 新增 KV 绑定，**绑定变量名必须填写** `img_url`，选中刚创建的命名空间
- 保存全部配置，重新触发一次项目部署使绑定生效

#### [4.5.3 D1 SQL 数据库创建、初始化 SQL、项目绑定完整操作](#_453-d1-sql-数据库创建初始化-sql项目绑定完整操作)

- 后台侧边栏进入 **D1** 面板，点击创建数据库，自定义名称 `imgbed-d1`
- 进入数据库「查询」页面，执行以下初始化建表 SQL：

sql

```
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    value TEXT,
    metadata TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT,
    file_size TEXT,
    upload_ip TEXT,
    upload_address TEXT,
    list_type TEXT,
    timestamp INTEGER,
    label TEXT,
    directory TEXT,
    channel TEXT,
    channel_name TEXT,
    tg_file_id TEXT,
    tg_chat_id TEXT,
    tg_bot_token TEXT,
    is_chunked BOOLEAN DEFAULT FALSE,
    tags TEXT, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    category TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS index_operations (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    data TEXT NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS index_metadata (
    key TEXT PRIMARY KEY,
    last_updated INTEGER,
    total_count INTEGER DEFAULT 0,
    last_operation_id TEXT,
    chunk_count INTEGER DEFAULT 0,
    chunk_size INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS other_data (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_files_timestamp ON files(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_files_directory ON files(directory);
CREATE INDEX IF NOT EXISTS idx_files_channel ON files(channel);
CREATE INDEX IF NOT EXISTS idx_files_file_type ON files(file_type);
CREATE INDEX IF NOT EXISTS idx_files_upload_ip ON files(upload_ip);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_tags ON files(tags);

CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);

CREATE INDEX IF NOT EXISTS idx_index_operations_timestamp ON index_operations(timestamp);
CREATE INDEX IF NOT EXISTS idx_index_operations_processed ON index_operations(processed);
CREATE INDEX IF NOT EXISTS idx_index_operations_type ON index_operations(type);

CREATE INDEX IF NOT EXISTS idx_other_data_type ON other_data(type);

CREATE TRIGGER IF NOT EXISTS update_files_updated_at 
    AFTER UPDATE ON files
    BEGIN
        UPDATE files SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_settings_updated_at 
    AFTER UPDATE ON settings
    BEGIN
        UPDATE settings SET updated_at = CURRENT_TIMESTAMP WHERE key = NEW.key;
    END;

CREATE TRIGGER IF NOT EXISTS update_index_metadata_updated_at 
    AFTER UPDATE ON index_metadata
    BEGIN
        UPDATE index_metadata SET updated_at = CURRENT_TIMESTAMP WHERE key = NEW.key;
    END;

CREATE TRIGGER IF NOT EXISTS update_other_data_updated_at 
    AFTER UPDATE ON other_data
    BEGIN
        UPDATE other_data SET updated_at = CURRENT_TIMESTAMP WHERE key = NEW.key;
    END;
```

- 回到 Pages 项目绑定面板，新增 D1 绑定，**绑定变量名必须是** `img_d1`，关联新建数据库
- 重新部署项目，数据库绑定配置正式生效

### [4.6 绑定 KV、D1、R2 存储](#_46-绑定-kvd1r2-存储)

- 打开创建好的 CLoudFlare-ImgBed pages 项目，找到设置→绑定
- 添加 KV 或者 D1 其中一个，再添加 R2 存储。
- KV 填写，名称：img_url 值：cloudflare_imgbed_kv
- D1 数据库，名称：img_d1 值：cloudflare_imgbed_d1
- R2 存储桶，名称：img_r2 值：cloudflare_imgbed_r2
- **值，以自己创建的为主，名称必须固定**

### [4.7 重新部署](#_47-重新部署)

设置好一切后，就点击重新部署，那么以上绑定的就会生效。

---

## [5 登录后台以及初始化](#_5-登录后台以及初始化)

### [5.1 后台登录密码账号资料填写](#_51-后台登录密码账号资料填写)

- 访问 Pages 生成的项目域名，进入初始化配置页面
- 自定义管理员登录账号、密码，离线备份保存，用于后台登录鉴权
- 全局权限配置建议关闭匿名上传，防止外部人员恶意上传占用存储额度

### [5.2 其他 S3 存储桶填写](#_52-其他-s3-存储桶填写)

- S3 Secret Access
- S3 Key，私钥凭证
- 存储桶名称
- 区域端点地址

---

## [6 功能测试验证](#_6-功能测试验证)

- 基础上传和图片访问测试
- 使用管理员账号登录后台，上传 PNG / JPG / WebP / GIF 合规图片文件
- 上传完成页面自动生成 CDN 访问链接，浏览器直接打开链接，图片正常加载无 403 / 500 报错
- 刷新资源列表页面，已上传图片完整展示，元数据无丢失、错乱
- 执行图片删除操作，资源同步从 R2 存储、元数据库清除
- 异常场景校验：上传 exe / zip / txt 非图片文件，接口拦截并返回错误提示
- 跨域兼容性测试：将图片链接嵌入博客、笔记编辑器，无防盗链拦截，图片正常渲染

---

## [7 总结](#_7-总结)

- Cloudflare ImgBed 采用 Pages + R2 + KV/D1 无服务器架构，免费额度完全覆盖个人使用场景，全球 CDN 解决图片跨地域访问延迟问题
- Pages 部署方案自带可视化管理后台，操作门槛低，适配博客站长、笔记用户；纯 Workers 方案仅适合自动化接口调用场景
- 完整标准化部署流程：Fork 开源仓库 → Pages 创建项目并配置构建参数 → 二选一绑定 KV/D1 元数据存储 → 绑定 R2 对象存储 → 后台初始化配置
- 生产环境安全规范：所有存储密钥、凭证统一通过 Cloudflare 后台资源绑定注入，禁止前端硬编码密钥，规避资源盗刷风险
- 平台存在硬性资源约束：Workers 内存上限、R2 10GB 免费存储、KV 容量限制，大量高清原图场景需定期清理闲置图片，防止超出免费配额产生计费

Created with ❤️ by 张萌萌