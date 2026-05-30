# 陆上江南

这是 `blog.wujinxing.site` 的源码仓库，一个基于 AstroPaper 改造的中文个人博客。

项目从 AstroPaper 模板出发，保留了文章、标签、归档、RSS、站内搜索、亮暗模式等基础能力，同时做了中文本地化、页面精简、字体收口和内容清理。当前目标很简单：写文章，少折腾，让站点保持轻、稳、容易维护。

## 主要改动

- 中文 UI 与中文日期格式
- 首页精简为最新文章列表
- 归档页改为紧凑的年/月/日结构
- Pagefind 静态全文搜索
- RSS 与 sitemap
- 本地代码字体 `JetBrains Mono`
- 系统中文衬线字体栈
- 移除分享组件与动态 OG 图片生成
- 模板文章移入 `docs/templates/posts/` 作为参考资料

## 项目结构

```text
.
├── astro-paper.config.ts       # 站点配置
├── astro.config.ts             # Astro 配置
├── docs/
│   └── templates/              # 从 AstroPaper 保留的模板文章参考
├── public/
│   ├── favicon.svg
│   └── fonts/                  # 本地静态字体
└── src/
    ├── components/             # 通用组件
    ├── content/
    │   ├── pages/              # about 等独立页面
    │   └── posts/              # 正式博客文章
    ├── i18n/                   # 多语言文案
    ├── layouts/                # 页面布局
    ├── pages/                  # Astro 路由
    ├── scripts/                # 客户端脚本
    ├── styles/                 # 全局样式与主题变量
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

`pnpm build` 会执行类型检查、静态构建，并在 `dist/pagefind/` 生成 Pagefind 搜索索引。部署时只需要发布 `dist/` 目录。

## 写作

正式文章放在 `src/content/posts/`，支持 Markdown 和 MDX。常用 frontmatter：

```yaml
---
author: kingstar718
pubDatetime: 2026-05-30T00:00:00Z
title: 文章标题
featured: false
draft: false
tags:
  - blog
description: 文章摘要
---
```

草稿文章设置 `draft: true`。生产构建会自动过滤草稿和未到发布时间的文章。

## 配置

站点标题、描述、作者、分页数量、功能开关、社交链接等集中在 `astro-paper.config.ts`。

搜索由 Pagefind 提供，入口在 `/search/`。RSS 输出为 `/rss.xml`，sitemap 由 `@astrojs/sitemap` 生成。

## 来源

本项目基于 [AstroPaper](https://github.com/satnaing/astro-paper) 改造。原模板文档和示例文章保留在 `docs/templates/posts/`，方便后续查阅。

## License

MIT
