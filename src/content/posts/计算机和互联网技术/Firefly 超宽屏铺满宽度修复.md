---
title: Firefly 超宽屏铺满宽度修复
published: 2026-10-19
description: 个人博客搭建过程的关键样式调整
tags:
  - 前端
  - 博客
category: 互联网技术
series: 个人网站搭建关键文档
seriesOrder: 1
---


## 目标
主页与文章页保留侧边栏、内容铺满；其余页面无侧栏、内容铺满。带鱼屏不得出现两侧留白。

## 定位过程
- 侧栏显隐此前已修好，剩余问题纯粹是宽度。
- dist 检查发现 `#content-panel-inner` 仍带 `max-w-(--page-width)`，而 `--page-width: 100rem`（1600px），来自 `src/config/siteConfig.ts` 的 `pageWidth: 100`，由 `Layout.astro` 注入 `:root`。
- 同时 `xl:w-[92vw]` 也限制宽度；此前用 `.content-full-width` CSS class 覆盖不可靠。

## 最终改动
1. `src/layouts/MainGridLayout.astro`：
   - class 改为 `relative w-full mx-auto pointer-events-auto`（移除 `xl:w-[92vw]`、`max-w-(--page-width)`）
   - style 改为 `width:100%;${gridColumnStyle}`
2. `src/components/layout/Navbar.astro`：
   - 内层 `max-w-(--page-width)` 改为按 `navbarWidthFull` 条件类，保持导航栏与内容一致
3. `src/utils/sidebar-effective-utils.ts`：`gridColumnStyle` 回归纯列变量（宽度由模板统一控制）

## 验证
- `pnpm build` 成功（Pagefind 80 页，exit 0）。
- dist 抽查：
  - `dist/index.html`：`style="width:100%;--cols-xl:var(--grid-sidebar-width) 1fr var(--grid-sidebar-width)"`，有侧栏
  - `dist/categories/index.html`：`style="width:100%;--cols-xl:1fr"`，无侧栏
  - 文章页同样 `width:100%`，三列几何
- 临时诊断脚本已全部删除；`pnpm preview` 已停止。

## 备注
- 分类卡片 auto-fit（min 260px）使列数随视口自然增加。
- 若后续想要“超宽屏内容更易读”，可加可选上限（如 2400px），但当前按用户要求完全铺满。
