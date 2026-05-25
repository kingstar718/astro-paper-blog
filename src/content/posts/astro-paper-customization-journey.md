---
author: kingstar718
pubDatetime: 2026-05-25T00:00:00Z
modDatetime: 2026-05-25T00:00:00Z
title: AstroPaper 博客改造日志
featured: false
draft: false
tags:
  - astro
  - blog
  - 折腾
description: 持续记录从 AstroPaper 模板出发，将博客一步步打磨成顺手的中文个人站点的过程。
---

基于 [AstroPaper](https://github.com/satnaing/astro-paper) 模板搭建了这个博客。AstroPaper 是一个极简、响应式、无障碍友好的 Astro 博客主题，支持亮暗模式切换，自带文章系统、标签、归档、搜索、RSS 等功能。

这篇日志持续记录对它的改动，会随提交不断更新。

## 2026-05-21 — 中文本地化

新建中文翻译文件 `src/i18n/lang/zh.ts`，逐条翻译了导航、文章页、分页、首页、页脚、404 等所有 UI 文案，默认语言切换为 `zh`。

日期格式方面，引入 dayjs 中文 locale，改为 `2025年3月22日 周六` 的形式。

删除了 `_releases`（版本发布记录）和 `_color-schemes`（颜色方案文档）两个目录及其图片资源。额外清理了 about 页面和依赖更新文章中的示例图片引用。

新增了一篇 Markdown 功能测试文章，验证中英文混排效果。`.gitignore` 加入 `.claude` 目录。

## 2026-05-21 — 中文字体

字体的选择和加载折腾了三轮。

**第一轮**：通过 Astro 内置的 `@astrojs/fonts` 加载 Noto Sans SC（思源黑体），设为 `--font-app` 的回退字体。

**第二轮**：发现黑体不适合长篇阅读，换为 Noto Serif SC（思源宋体）。但 CJK 字体文件体积太大（单个字重 5-10 MB），Astro 字体系统在构建时下载超时，只能放弃。

**第三轮**：改为通过 Google Fonts CDN 的 `<link>` 标签直接加载，配合 `preconnect` 优化。加载 400、500、700 三个字重，CSS 中设置为中文回退：

```css
--font-app: var(--font-google-sans-code), "Noto Serif SC", sans-serif;
```

西文 Google Sans Code，中文思源宋体，各取所需。

## 2026-05-22 — 首页与归档布局

首页大删减：去掉了 hero 区域的介绍段落、RSS 图标、社交链接。不再区分"精选文章"和"最近文章"，直接展示最新 N 篇文章流，底部保留"全部文章"链接按钮。打开即见文章列表。

归档页从完整 Card 改为紧凑展示。Card 组件新增 `compact` 变体——单行，左侧 `MM-DD` 日期，右侧标题。顺手修了首篇文章与月份标签未对齐的问题。

同日下午修复了 Datetime 组件中的冗余日期格式化代码。

## 2026-05-25 — 移除分享组件

删除了文章页的"分享这篇文章"功能——Twitter/Facebook 等平台在国内基本不用，浏览器自带复制链接足够了。

具体清理：删除 `ShareLinks.astro` 组件及其在文章页的引用，移除 `astro-paper.config.ts` 和类型定义中的 `shareLinks` 配置，删除 i18n 中 `sharePostIntro` 等翻译键，清理 facebook、telegram、pinterest、whatsapp 四个纯分享用途的 SVG 图标。

顺手把 zh.ts 中页脚的"版权所有 保留所有权利"改回英文 `Copyright / All rights reserved.`——中文法律措辞放在个人博客上太突兀。

## 2026-05-25 — 精简社交链接

页脚社交图标从 4 个（GitHub、X、LinkedIn、邮箱）精简为 2 个，去掉国内基本不用的 X 和 LinkedIn，只保留 GitHub 和邮箱，并替换为实际地址：

- GitHub: `https://github.com/kingstar718`
- 邮箱: `kingstar718@foxmail.com`

配置文件从 `astro-paper.config.ts` 的 `socials` 数组中移除对应条目即可，组件层面自动适配。

## 2026-05-25 — 配置修正与内容清理

修正了两项残留的模板配置：

- `profile` 链接从 `https://satna.ing` 改为 `https://github.com/kingstar718`
- `editPost.url` 从 `satnaing/astro-paper` 改为 `kingstar718/astro-paper-blog`

About 页面从英文模板介绍重写为简短的个人标识：「陆上江南的博客」。

`examples/` 目录下 4 篇英文示例文章和根级 3 篇模板指导文章（`adding-new-post`、`customizing-astropaper-theme-color-schemes`、`how-to-configure-astropaper-theme`）全部设为草稿（`draft: true`），不再公开显示，但保留原文件以备后续参考。

## 2026-05-25 — 修复本地编译

字体加载在本地编译时失败，因为构建过程无法访问 `fonts.google.com`。问题出在两处：`astro.config.ts` 中的 `fonts` 配置触发构建时下载字体；OG 图片生成依赖构建时下载的字体数据。

**字体改为纯 CDN 加载**：移除 `astro.config.ts` 中的 `fonts` 配置和 `fontProviders` 导入，`Layout.astro` 中用 Google Fonts CDN `<link>` 标签替换 `<Font>` 组件，`Google Sans Code` 与 `Noto Serif SC` 合并为一条请求。这对运行时毫无影响——字体依然从 Google Fonts 加载，只是不再在构建阶段下载。

**关闭动态 OG 图片**：`features.dynamicOgImage` 设为 `false`，使用已有的 `public/default-og.jpg` 作为默认社交图片。删除 `og.png.ts`、`index.png.ts` 路由文件和 `getFontPathByWeight.ts` 工具函数，这几个文件全部依赖构建时字体数据。

**顺手清理**：`Datetime.astro` 中删除未使用的 `useTranslations` 导入和 `t` 变量，编译从 1 hint 变为 0 hints。

最终编译结果：0 errors / 0 warnings / 0 hints，23 个页面正常生成。