# 陆上江南

这是 `blog.wujinxing.site` 的源码仓库，一个基于 AstroPaper 改造的中文个人博客。

站点只有两类内容：**文章**和**短文**，都按时间倒序排在一条时间线上。目标很简单：写东西，少折腾，让站点保持轻、稳、容易维护。

## 内容与页面

| 路径                 | 内容                                              |
| -------------------- | ------------------------------------------------- |
| `/`                  | 文章 + 短文混排时间线，实心点是文章、空心点是短文 |
| `/posts`、`/posts/2` | 全部文章，分页，页尾有总数与年份统计              |
| `/notes`、`/notes/2` | 全部短文，同上                                    |
| `/posts/<slug>`      | 文章详情，带目录和上一篇/下一篇                   |
| `/about`             | 关于                                              |
| `/search`            | Pagefind 静态全文搜索                             |
| `/rss.xml`           | RSS                                               |

**短文**（`src/content/notes/`）是零碎想法和片段，没有标题也没有详情页，在列表里直接展开读。

## 主要改动

相对 AstroPaper 原版：

- 中文 UI 与中文日期格式（`YYYY-MM-DD HH:mm:ss ddd`）
- 新增短文内容类型，与文章共用一套时间线组件
- 首页、文章列表、短文列表统一为时间线布局，条目渲染完全一致
- 本地托管并按 `unicode-range` 分包加载的 Noto 变量字体，系统中文衬线回退
- 移除标签系统、面包屑、分享组件、动态 OG 图片
- 移除返回按钮、回到顶部、阅读进度条、「编辑页面」链接
- 移除模板自带的示例文章与文档

## 项目结构

```text
.
├── astro-paper.config.ts       # 站点配置（改这里）
├── astro.config.ts             # Astro / Markdown / 代码高亮配置
├── public/
│   ├── favicon.svg
│   └── fonts/                  # 本地静态字体与 @font-face
└── src/
    ├── components/             # 通用组件（Timeline* / Datetime / Header ...）
    ├── content/
    │   ├── pages/              # about 等独立页面
    │   ├── posts/              # 文章
    │   └── notes/              # 短文
    ├── content.config.ts       # 内容集合与 frontmatter 校验
    ├── i18n/                   # UI 文案（zh / en）
    ├── layouts/                # 页面布局
    ├── pages/                  # 路由
    ├── scripts/                # 客户端脚本
    ├── styles/                 # 全局样式与主题变量
    ├── types/                  # 配置类型
    └── utils/                  # 工具函数
```

## 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm format:check
```

`pnpm build` 会依次执行类型检查、静态构建，并在 `dist/pagefind/` 生成搜索索引。部署只需发布 `dist/`。

## 写作

文章放 `src/content/posts/`，支持 Markdown 和 MDX：

```yaml
---
author: kingstar718
pubDatetime: 2026-05-30T00:00:00Z
title: 文章标题
featured: false
draft: false
description: 文章摘要
---
```

短文放 `src/content/notes/`，只需要时间：

```yaml
---
pubDatetime: 2026-07-21T02:00:00Z
---
```

`draft: true` 的内容和未到发布时间的内容不会出现在生产构建里。

## 配置地图

设置分散在几处（AstroPaper 的固有结构）。想改 X 该去哪个文件：

| 想改的东西                              | 去哪里                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------- |
| 标题 / 描述 / 作者 / URL / 时区 / 语言  | `astro-paper.config.ts` → `site`                                            |
| 每页文章数、首页文章数、定时发布窗口    | `astro-paper.config.ts` → `posts`                                           |
| 每页短文数、首页短文数                  | `astro-paper.config.ts` → `notes`                                           |
| 功能开关（明暗模式、搜索）              | `astro-paper.config.ts` → `features`                                        |
| 社交链接                                | `astro-paper.config.ts` → `socials`（图标放 `src/assets/icons/socials/`）   |
| 配置默认值 / 字段说明                   | `src/config.ts`、`src/types/config.ts`（一般不用动）                        |
| frontmatter 字段与校验                  | `src/content.config.ts`                                                     |
| 所有 UI 文案                            | `src/i18n/lang/zh.ts`、`en.ts`（结构见 `types.ts`）。**不要在组件里硬编码** |
| 主题色、字体族                          | `src/styles/theme.css`（`--accent` / `--font-app` / `--font-code`）         |
| 正文排版、代码块样式                    | `src/styles/typography.css`（`.astro-code` 段是代码块）                     |
| 布局工具类（`app-layout`、`max-w-app`） | `src/styles/global.css`                                                     |
| 代码高亮主题、Markdown 插件             | `astro.config.ts` → `markdown`                                              |
| 时间线的竖线、圆点、条目间距            | `src/components/Timeline.astro`、`TimelineItem.astro`                       |

## 来源

基于 [AstroPaper](https://github.com/satnaing/astro-paper) 改造。原模板的文档和示例文章已全部移除，需要查阅去上游仓库。

## License

MIT
