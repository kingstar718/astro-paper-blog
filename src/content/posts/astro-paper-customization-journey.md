---
author: kingstar718
pubDatetime: 2026-05-25T00:00:00Z
modDatetime: 2026-05-30T07:58:00Z
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

## 2026-05-30 — 文章页脚本幂等化

继续清理文章页的客户端脚本。之前的实现每次进入文章页都会重新创建阅读进度条、重新给标题追加 `#` 锚点、重新包裹代码块并插入复制按钮；在启用 Astro 客户端路由后，来回切页时有重复插入 DOM 和重复绑定事件的风险。

这次把脚本改成“可重复执行但结果不重复”：

- 阅读进度条改为固定 ID，若已存在则复用
- 滚动监听和 `astro:after-swap` 监听在重新绑定前先移除旧实例
- 标题锚点仅在缺失时追加
- 代码块按钮仅在不存在时插入，外层包裹节点也只创建一次

顺手把代码块复制按钮文案从英文 `Copy / Copied` 改成中文 `复制 / 已复制`，和整站语言保持一致。

本地预览里来回切换文章页后复查，进度条、标题锚点和复制按钮数量都保持不变，说明这部分脚本已经稳定下来。

## 2026-05-30 — 模板文章下线与字体方案收口

又做了一轮“减法”，主要目的是让公开内容和实际站点风格更一致。

先把还在公开状态的 5 篇 AstroPaper 模板文章全部改为草稿：动态 OG、依赖更新、Git Hooks 日期、Giscus 评论、LaTeX 公式。它们仍然保留在仓库里，后面需要参考时随时可翻，但不再出现在首页、文章列表、归档、RSS 和搜索结果中。

这样处理后，首页公开文章只剩真正属于当前博客的内容，站点气质会更统一，不会再混入一批模板作者的英文教程。

字体方面也做了收口。上一版尝试通过 Fontsource 直接引用 `node_modules` 下的 woff2 文件，虽然源码层面看似可行，但复查构建产物后发现这种写法不够稳，继续保留只会让后续维护成本变高。

最后回到更朴素也更可靠的方案：

```css
--font-app: "Songti SC", "STSong", "Source Han Serif SC", "Noto Serif CJK SC", "SimSun", serif;
```

也就是正文直接使用系统自带的中文衬线字体栈；代码字体继续保留本地 `JetBrains Mono`。同时移除了 `@fontsource/noto-sans` 和 `@fontsource/noto-serif-sc` 依赖，`fonts.css` 只保留代码字体的 `@font-face`。

这样做虽然不再追求所有平台上一模一样的中文字形，但换来了三个好处：

- 构建链路更短，不再依赖字体包内部路径
- 运行时更稳，不会出现“源码声明了字体，产物里却没有真正打包”的不确定性
- 资源体积更轻，正文不再额外下载中文字体文件

本轮调整后重新执行 `pnpm build`，`astro check`、静态构建和 Pagefind 索引生成均通过；公开页面数量从 23 页收缩到 14 页，搜索索引也随之只保留当前真正对外展示的文章内容。

## 2026-05-30 — 项目说明与内容目录收口

继续把仓库从“套了 AstroPaper 的模板项目”整理成真正属于这个博客的项目。

首先重写了 `README.md`。旧 README 仍然保留大量原模板说明，包括已经删除的默认 OG 图片、动态 OG 功能、原作者联系方式和模板初始化命令。新版本改为说明当前博客的定位、目录结构、常用命令、写作方式和配置入口，并明确部署时发布 `dist/` 目录。

About 页面也从一句占位介绍扩展为真正的个人博客说明：这个站点写什么、为什么保留静态博客形态、以及读者能在这里看到哪些内容。

模板文章则整体移出正式内容目录：

```text
src/content/posts/        # 只放正式博客文章
docs/templates/posts/     # 保留 AstroPaper 模板文章作为参考资料
```

这样 `src/content/posts/` 里只剩公开内容，不再混着一堆草稿模板文件；日后查找、搜索和新增文章都会更清楚。

最后顺手修了构建脚本。以前 `pnpm build` 会在 Pagefind 索引生成后执行 `cp -r dist/pagefind public/`，把构建产物再写回源码目录。现在搜索索引只保留在 `dist/pagefind/`，部署 `dist/` 即可，不再污染 `public/`。

搜索页开发态提示也改成中文。至此，模板尾巴又少了一截。

## 2026-05-30 — 清理测试内容与历史计划

继续清掉几处不再适合留在正式站点里的内容。

`public/pagefind/` 是旧构建脚本留下的本地搜索索引，现在构建产物只保留在 `dist/pagefind/`，因此直接删除本地残留目录，避免把生成文件误认为源码资产。

`docs/superpowers/` 里保存的是早期字体替换计划，内容还停留在 Noto Sans SC、Inter、Google Sans Code 等旧方案上，和当前系统衬线字体栈已经不一致。为了避免后续误读，删除这两份过期计划文档。

社交图标也继续精简：`linkedin.svg` 和 `x.svg` 已经没有实际配置引用，页脚只保留 GitHub 和邮箱，所以这两个图标文件一并移除。

最后把 Markdown 功能测试文章移出公开内容目录，放到 `docs/testing/markdown-feature-test.md`。它仍然可以作为排版回归测试参考，但不再作为博客文章公开展示。
