---
author: kingstar718
pubDatetime: 2026-05-25T00:00:00Z
modDatetime: 2026-05-29T18:05:00Z
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

## 2026-05-25 — 字体本地化与英文字体补充

彻底告别 Google Fonts CDN，全部字体回归本地文件。同时补上了之前缺失的英文正文字体和代码字体。

**删除 CDN 依赖**：`Layout.astro` 中移除 Google Fonts `<link>` 标签和 `preconnect`，`fonts.css` 精简为纯 `@font-face` 规则。不再依赖任何外部字体服务。

**新增英文字体 Inter**：正文用 `Inter`（400 + 700 两个字重），从 jsDelivr CDN 下载 woff2 放到 `public/fonts/`。Inter 是为屏幕阅读设计的无衬线字体，x-height 高、辨识度好，搭配中文宋体也不违和。单字重仅 24 KB。

**新增代码字体 JetBrains Mono**：原计划用 Google Sans Code，但在 jsDelivr 上不可用（该字体未公开发布 woff2），改用 JetBrains Mono。程序员最熟悉的等宽字体之一，连字支持和字符区分度都很好，单字重 21 KB。

**字体栈最终形态**：
```css
--font-app: "Noto Serif SC", "Inter", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
--font-code: "JetBrains Mono", ui-monospace, "Cascadia Code", "Source Code Pro", monospace;
```

中文走思源宋体，英文走 Inter，代码走 JetBrains Mono，各司其职。总字体包 10.7 MB（其中中文 10.7 MB，英文字体不到 70 KB），全部本地托管，零外部请求。

## 2026-05-29 — 移除大体积中文字体

复查字体资源后，发现 `public/fonts/noto-serif-sc.woff2` 单文件约 10.7 MB，已经成为静态资源里最重的一项。为了减小站点体积，移除了本地 Noto Serif SC 文件和对应的 `@font-face` 规则。

正文字体栈改为：

```css
--font-app: "Inter", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
```

英文和数字继续走本地 `Inter`，中文交给系统字体：macOS 优先 `PingFang SC`，Windows 优先 `Microsoft YaHei`，其他环境回退到 `system-ui`。这样牺牲了一点跨平台字体一致性，但直接减少约 11 MB 的字体传输和仓库体积，对博客场景更划算。

本次构建验证中，`astro check`、`astro build` 和 Pagefind 索引生成均通过；完整 `pnpm run build` 在 Windows 下最后停在原有脚本的 `cp -r dist/pagefind public/`，因为 `cp` 不是 Windows 内置命令，和字体调整无关。

## 2026-05-29 — 改用 Fontsource 托管 Noto 字体

最终还是希望中文保持 `Noto Serif SC` 的阅读气质，英文正文则改为 `Noto Sans`。Astro 的在线字体能力在中国大陆构建时不稳定，所以改用 Fontsource npm 包，把字体作为依赖安装到项目里，由 Vite 在构建时本地处理。

引入的字重为 400 和 700。没有直接使用 Fontsource 自带 CSS，因为它会同时引用 `woff2` 和 `woff`；项目里只保留现代浏览器需要的 `woff2`：

```css
src: url("../../node_modules/@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2")
  format("woff2");
src: url("../../node_modules/@fontsource/noto-serif-sc/files/noto-serif-sc-chinese-simplified-400-normal.woff2")
  format("woff2");
```

字体栈更新为：

```css
--font-app: "Noto Sans", "Noto Serif SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
```

`Noto Sans` 只加载 Latin 400/700，单个 woff2 约 13 KB；`Noto Serif SC` 使用 Fontsource 的 `chinese-simplified` 400/700，两个 woff2 合计约 3.06 MB。相比最初 10.7 MB 的完整中文字体文件，体积更可控，也不依赖 Google Fonts 的在线访问。
