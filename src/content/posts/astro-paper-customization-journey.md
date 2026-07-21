---
author: kingstar718
pubDatetime: 2026-05-25T00:00:00Z
modDatetime: 2026-07-21T07:58:21Z
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

这篇日志持续记录对它的改动，会随提交不断更新，按日期倒序排列。

## 2026-07-21

### 首页改为文章 + 短文统一时间线

把原本分散的「首页 / 文章列表 / 归档」三处看文章的入口合并：首页直接是一条按时间倒序的时间线，文章与短文混排。文章显示为标题卡片，短文（新增的 `notes` 内容集合）在列表里直接内联展开正文，标题可有可无。首页文章、短文各取最近 `perIndex` 条。

导航也随之精简为「文章 / 短文 / 标签 / 关于」——首页入口交给左上角站点标题，不再单列。文章、短文各有独立列表页；这些列表页（含标签、关于、搜索）统一去掉了面包屑、页面大标题和描述，进页直接是内容本身。

### 文章页改造为年份时间轴，移除独立归档

文章页从「完整卡片列表」改成参考 [Lapis](https://www.lapis.cafe/) 主题的时间轴样式：按年份分组，年份头是大号年数 + 当年篇数 + 一条填充横线；每年一列，列左侧一条细竖线，每篇是「`MM-DD` 等宽日期 + 标题」一行，整行 hover 高亮、标题变强调色，精选文章标题前带一个星标。

由于文章页本身已经是按日期归档的视图，原来的独立归档页（`/archives`）连同 `showArchives` 配置、页脚归档入口一并删除，归档能力完全并入文章页。分组用的 `getPostsByGroupCondition` 移到 `src/utils/` 共用。

### 列表排版精简与死代码清理

时间线条目原本「标题 / 日期 / 描述」三行偏臃肿，改为标题与日期同一行（日期小号灰字、右对齐、去掉日历图标），描述另起一行。为此给 `Datetime` 加了 `icon` 开关，只在列表场景关掉图标，文章详情页日期不受影响。条目间距从 `my-6` 收到 `my-4`，正文段落间距从默认 `1.25em` 收到 `0.8em`。

顺手清理：删除 `Card` 组件中随文章页改造后不再使用的 `compact` 变体，以及一批因页面调整而失效的 i18n 键（首页 `home.*`、各列表页的 `*Desc`、`nav.archives` 等）。

### 升级到 Astro 7

把 Astro 从 6.4.8 升级到 7.1.1，`@astrojs/mdx` 从 5 升到 7，sitemap、rss 一并跟到兼容版本。Node 要求不变（`>=22.12.0`）。

Astro 7 默认改用原生的 Satteri 引擎渲染 Markdown，不再走 remark/rehype。本站重度依赖 `remark-toc`、`remark-collapse` 和 shiki 的自定义 transformer，因此选择保守路径：安装 `@astrojs/markdown-remark`，把 markdown 配置迁移到 `processor: unified({ remarkPlugins: [...] })`，shiki 配置保持不动。现有高亮和插件行为完全不变。

顺带解决了升级前就存在的 `tailwindcss()` Vite 插件类型报错——它随 Vite 8 与 `@tailwindcss/vite` 4.3.3 对齐后自动消失。

### 精简 i18n 与移除模板残留

i18n 加载机制过度设计：原本用 `import.meta.glob` 动态扫描语言目录，对只有中英两种语言来说没必要。改为直接静态 import `zh` 和 `en`，删除从未被调用的 `format.ts`（`tplStr` 死代码），并清理了一批没有引用的翻译键。

项目里还堆着不少模板残留，一并清掉：

- Docker 相关（`Dockerfile`、`docker-compose.yml`、`.dockerignore`）——本站不用容器部署
- `cz.yaml`（commitizen 配置，实际未安装）、上游的 `CHANGELOG.md`、`AstroPaper-lighthouse-score.svg` 徽章
- `.github/` 下的开源协作模板（贡献指南、行为准则、issue/PR 模板），以及仍指向原作者的 `FUNDING.yml`

最后对全仓做了一次 prettier 格式化，把此前积累的格式漂移统一掉。

### UI 文案收敛与配置地图

站点本有完整的 i18n 机制，但个别文案仍硬编码在组件里——首页的“全部文章”按钮、文章页的“复制 / 已复制”。把它们收回 i18n（内联脚本通过 `data-*` 属性拿到翻译值），从此“改文案 = 只改 i18n”这条规则才真正成立。

另外新增了 `docs/config-map.md` 配置地图：用一张“想改 X 该去哪个文件”的对照表，解决设置分散在 `astro-paper.config.ts`、`theme.css`、`astro.config.ts` 等多处、不好找的问题，并在相关文件之间加了交叉引用注释。

### 文章目录（TOC）

给文章页加了目录。数据来自 `render()` 返回的 `headings`，构建期直接生成，不在客户端解析 DOM。

- **桌面端**：在正文右侧空白区悬浮，随滚动高亮当前章节（scroll-spy），可折叠，展开状态记在 `localStorage`
- **移动端**：正文顶部内联折叠，默认收起，点开跳转

只列 `h2` / `h3`，标题少于两个的文章不显示目录。

### 导航栏重新设计

旧导航栏把“去页面”和“就地操作”混在一起：文章、标签、关于是文字，归档却是图标，移动端又换成另一套两列网格，缺乏统一心智。

重新按“导航是文字、工具是图标”分组：

- 桌面端：文章、标签、关于、归档四个文字导航并列，用分隔线隔开搜索、主题切换两个图标工具
- 移动端：搜索和主题图标常驻，汉堡按钮展开文字导航下拉，与桌面端保持同一套结构

同时把选中项的波浪下划线改为强调色加粗，并清理了重构后不再使用的 `IconArchive`、`IconUnderline` 图标和一个未定义的遗留样式类。

## 2026-06-22

### 字体 · Noto 全家族与中文分包

最终方案统一使用 Noto 字体家族：

- 英文正文使用 `Noto Serif`
- 简体中文使用 `Noto Serif SC`
- 行内代码、代码块和等宽数字使用 `Noto Sans Mono`

三套字体全部托管在站点自身的 `public/fonts/` 目录，不请求 Google Fonts 或其他境外字体 CDN。

中文字体采用 `unicode-range` 分包，将 Noto Serif SC 拆成 101 个 WOFF2 文件。浏览器会根据当前页面出现的字符，只下载对应分片，而不是一次加载完整字库。

字体资源整体情况如下：

```text
Noto Serif       2 个拉丁字符分片    约 0.21 MB
Noto Serif SC    101 个中文分片      完整约 5.75 MB
Noto Sans Mono   2 个拉丁字符分片    约 0.18 MB
```

这里的 5.75 MB 是服务器保存的完整中文字库总量，不是单个页面的下载量。已加载的分片可以被浏览器长期缓存，访问其他文章时只补充尚未缓存的字符分片。

最终字体变量为：

```css
--font-app:
  "Noto Serif Variable", "Noto Serif SC Variable", "Songti SC", "STSong",
  "Source Han Serif SC", "Noto Serif CJK SC", "SimSun", serif;

--font-code:
  "Noto Sans Mono Variable", ui-monospace, "Cascadia Mono", "Cascadia Code",
  monospace;
```

原来的 JetBrains Mono 文件和声明已经移除。Tailwind 的 `font-mono` 也指向 `--font-code`，归档日期等界面元素会和代码区域使用同一套等宽字体。

字体 CSS 最初通过全局样式中的 `@import` 加载，但经过 Tailwind 和 PostCSS 展开后触发了 `@import must precede all other statements` 警告。最终改为在 `Layout.astro` 的 `<head>` 中加载三份同源字体样式表，并通过 `getAssetPath()` 生成路径，以兼容子目录部署。

## 2026-05-30

### 文章页脚本幂等化

继续清理文章页的客户端脚本。之前的实现每次进入文章页都会重新创建阅读进度条、重新给标题追加 `#` 锚点、重新包裹代码块并插入复制按钮；在启用 Astro 客户端路由后，来回切页时有重复插入 DOM 和重复绑定事件的风险。

这次把脚本改成“可重复执行但结果不重复”：

- 阅读进度条改为固定 ID，若已存在则复用
- 滚动监听和 `astro:after-swap` 监听在重新绑定前先移除旧实例
- 标题锚点仅在缺失时追加
- 代码块按钮仅在不存在时插入，外层包裹节点也只创建一次

顺手把代码块复制按钮文案从英文 `Copy / Copied` 改成中文 `复制 / 已复制`，和整站语言保持一致。

本地预览里来回切换文章页后复查，进度条、标题锚点和复制按钮数量都保持不变，说明这部分脚本已经稳定下来。

### 模板文章下线

又做了一轮“减法”，主要目的是让公开内容和实际站点风格更一致。

先把还在公开状态的 5 篇 AstroPaper 模板文章全部改为草稿：动态 OG、依赖更新、Git Hooks 日期、Giscus 评论、LaTeX 公式。它们仍然保留在仓库里，后面需要参考时随时可翻，但不再出现在首页、文章列表、归档、RSS 和搜索结果中。

这样处理后，首页公开文章只剩真正属于当前博客的内容，站点气质会更统一，不会再混入一批模板作者的英文教程。

本轮调整后重新执行 `pnpm build`，`astro check`、静态构建和 Pagefind 索引生成均通过；公开页面数量从 23 页收缩到 14 页，搜索索引也随之只保留当前真正对外展示的文章内容。

### 项目说明与内容目录收口

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

### 清理测试内容与历史计划

继续清掉几处不再适合留在正式站点里的内容。

`public/pagefind/` 是旧构建脚本留下的本地搜索索引，现在构建产物只保留在 `dist/pagefind/`，因此直接删除本地残留目录，避免把生成文件误认为源码资产。

`docs/superpowers/` 里保存的是已经失效的早期改造计划。为了避免后续误读，删除了这些过期文档。

社交图标也继续精简：`linkedin.svg` 和 `x.svg` 已经没有实际配置引用，页脚只保留 GitHub 和邮箱，所以这两个图标文件一并移除。

最后把 Markdown 功能测试文章移出公开内容目录，放到 `docs/testing/markdown-feature-test.md`。它仍然可以作为排版回归测试参考，但不再作为博客文章公开展示。

### 字体 · 暂时回到系统字体

为了先保证构建链路简单可靠，中文正文暂时改回系统衬线字体栈：

```css
--font-app:
  "Songti SC", "STSong", "Source Han Serif SC", "Noto Serif CJK SC", "SimSun",
  serif;
```

代码字体继续使用本地 JetBrains Mono。这个阶段不再追求各平台字形完全一致，优先保证零外部请求和较小的资源体积。

## 2026-05-29

### 字体 · 在体积和一致性之间反复取舍

为了降低传输体积，一度移除本地中文字体，让不同平台分别回退到 `PingFang SC`、`Microsoft YaHei` 和 `system-ui`。这种方式最轻，但不同系统上的中文观感差异较大，也失去了想要的宋体阅读风格。

之后尝试通过 Fontsource 引入 Noto Sans 和 Noto Serif SC，只保留现代浏览器需要的 WOFF2。中文字体体积降到约 3.06 MB，但直接引用 `node_modules` 内部字体路径不够稳，构建产物也不容易验证。

## 2026-05-25

### 移除分享组件

删除了文章页的"分享这篇文章"功能——Twitter/Facebook 等平台在国内基本不用，浏览器自带复制链接足够了。

具体清理：删除 `ShareLinks.astro` 组件及其在文章页的引用，移除 `astro-paper.config.ts` 和类型定义中的 `shareLinks` 配置，删除 i18n 中 `sharePostIntro` 等翻译键，清理 facebook、telegram、pinterest、whatsapp 四个纯分享用途的 SVG 图标。

顺手把 zh.ts 中页脚的"版权所有 保留所有权利"改回英文 `Copyright / All rights reserved.`——中文法律措辞放在个人博客上太突兀。

### 精简社交链接

页脚社交图标从 4 个（GitHub、X、LinkedIn、邮箱）精简为 2 个，去掉国内基本不用的 X 和 LinkedIn，只保留 GitHub 和邮箱，并替换为实际地址：

- GitHub: `https://github.com/kingstar718`
- 邮箱: `kingstar718@foxmail.com`

配置文件从 `astro-paper.config.ts` 的 `socials` 数组中移除对应条目即可，组件层面自动适配。

### 配置修正与内容清理

修正了两项残留的模板配置：

- `profile` 链接从 `https://satna.ing` 改为 `https://github.com/kingstar718`
- `editPost.url` 从 `satnaing/astro-paper` 改为 `kingstar718/astro-paper-blog`

About 页面从英文模板介绍重写为简短的个人标识：「陆上江南的博客」。

`examples/` 目录下 4 篇英文示例文章和根级 3 篇模板指导文章（`adding-new-post`、`customizing-astropaper-theme-color-schemes`、`how-to-configure-astropaper-theme`）全部设为草稿（`draft: true`），不再公开显示，但保留原文件以备后续参考。

### 修复本地编译

本地编译一度因为构建阶段需要访问外部资源而失败。为缩短构建链路，关闭了动态 OG 图片：`features.dynamicOgImage` 设为 `false`，改用已有的静态默认图片，并删除相关图片生成路由和工具函数。

**顺手清理**：`Datetime.astro` 中删除未使用的 `useTranslations` 导入和 `t` 变量，编译从 1 hint 变为 0 hints。

最终编译结果：0 errors / 0 warnings / 0 hints，23 个页面正常生成。

### 字体 · 本地化

为了去掉外部依赖，字体开始转为本地托管。英文正文使用 Inter，代码使用 JetBrains Mono，中文使用本地 Noto Serif SC。

当时的字体栈是：

```css
--font-app:
  "Noto Serif SC", "Inter", "PingFang SC", "Microsoft YaHei", system-ui,
  sans-serif;

--font-code:
  "JetBrains Mono", ui-monospace, "Cascadia Code", "Source Code Pro", monospace;
```

这套方案解决了网络依赖，但完整的 Noto Serif SC 文件约 10.7 MB，成为站点最重的静态资源。

## 2026-05-22

### 首页与归档布局

首页大删减：去掉了 hero 区域的介绍段落、RSS 图标、社交链接。不再区分"精选文章"和"最近文章"，直接展示最新 N 篇文章流，底部保留"全部文章"链接按钮。打开即见文章列表。

归档页从完整 Card 改为紧凑展示。Card 组件新增 `compact` 变体——单行，左侧 `MM-DD` 日期，右侧标题。顺手修了首篇文章与月份标签未对齐的问题。

同日下午修复了 Datetime 组件中的冗余日期格式化代码。

## 2026-05-21

### 中文本地化

新建中文翻译文件 `src/i18n/lang/zh.ts`，逐条翻译了导航、文章页、分页、首页、页脚、404 等所有 UI 文案，默认语言切换为 `zh`。

日期格式方面，引入 dayjs 中文 locale，改为 `2025年3月22日 周六` 的形式。

删除了 `_releases`（版本发布记录）和 `_color-schemes`（颜色方案文档）两个目录及其图片资源。额外清理了 about 页面和依赖更新文章中的示例图片引用。

新增了一篇 Markdown 功能测试文章，验证中英文混排效果。`.gitignore` 加入 `.claude` 目录。

### 字体 · 从在线字体开始

字体是这个博客改动次数最多的一部分。目标一直没有变：中文适合长篇阅读，英文和代码清晰，同时保证国内访问稳定、构建过程可靠、字体体积可控。

最初通过 Astro 的字体能力加载 Noto Sans SC，随后因为更偏好中文衬线字体的阅读感，换成 Noto Serif SC。CJK 字库体积很大，构建阶段下载经常超时，因此又改为通过 Google Fonts CDN 加载。

这一阶段使用过 Google Sans Code 和 Noto Serif SC 的组合，但很快发现它存在两个问题：

- 国内网络访问 Google Fonts 不稳定
- 构建和运行依赖外部字体服务

---

> 本文部分内容由 AI 辅助生成，以下为更新记录。

<details>
<summary>📝 更新记录（最近：2026-07-21 15:58:21）</summary>

| 时间                | 操作 | 说明                                                                                                              | Agent                                 |
| ------------------- | ---- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 2026-07-21 15:58:21 | 修改 | 追加首页统一时间线与短文、文章页年份时间轴（参考 Lapis）与移除独立归档、列表排版精简与死代码清理等本轮改动记录    | Claude Code 2.1.215 / claude-opus-4-8 |
| 2026-07-21 11:02:54 | 排版 | 按日期倒序重构全文结构：日期作为章节标题（##），改动点作为子标题（###），并将字体主题条目并入各自日期             | Claude Code 2.1.215 / claude-opus-4-8 |
| 2026-07-21 10:52:45 | 修改 | 追加 Astro 7 升级、i18n 精简与模板残留清理、UI 文案收敛与配置地图、文章目录、导航栏重新设计等 2026-07-21 改动记录 | Claude Code 2.1.215 / claude-opus-4-8 |

</details>
