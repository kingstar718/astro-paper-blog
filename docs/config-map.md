# 配置地图

> 本项目的设置分散在几处（这是 AstroPaper 的固有结构）。这张表回答一个问题：
> **"想改 X，该去哪个文件？"**

## 站点级设置

| 想改的东西                                    | 去哪里                                        |
| --------------------------------------------- | --------------------------------------------- |
| 站点标题 / 描述 / 作者 / URL / 时区 / 语言    | `astro-paper.config.ts` → `site`              |
| 每页文章数 / 首页文章数 / 定时发布窗口        | `astro-paper.config.ts` → `posts`             |
| 功能开关（明暗模式、归档、返回按钮、编辑链接、搜索） | `astro-paper.config.ts` → `features`    |
| 社交链接                                      | `astro-paper.config.ts` → `socials`（图标放 `src/assets/icons/socials/`） |
| 默认值 / 配置解析逻辑                         | `src/config.ts`（一般不用动）                 |
| 配置类型 / 字段说明                           | `src/types/config.ts`                         |

## 内容

| 想改的东西                        | 去哪里                                    |
| --------------------------------- | ----------------------------------------- |
| 文章 frontmatter 字段 / 校验规则  | `src/content.config.ts`                   |
| 文章存放目录                      | `src/content/posts/`（路径常量 `BLOG_PATH`） |
| 独立页面（如 about）              | `src/content/pages/`                      |

## 外观 / 呈现

| 想改的东西                        | 去哪里                                                        |
| --------------------------------- | ------------------------------------------------------------- |
| 主题色（明暗 accent / 背景 等）   | `src/styles/theme.css`                                        |
| 字体族                            | `src/styles/theme.css`（`--font-app` / `--font-code`）；字体文件与 @font-face 在 `public/fonts/`；加载 `<link>` 在 `src/layouts/Layout.astro` |
| 正文排版（prose）                 | `src/styles/typography.css`                                   |
| 代码高亮主题                      | `astro.config.ts` → `markdown.shikiConfig.themes`             |
| 代码块样式（背景、diff、高亮行）  | `src/styles/typography.css` 的 `.astro-code` 段               |
| 全局基础样式 / 布局工具类         | `src/styles/global.css`（如 `max-w-app`、`app-layout`）        |

## 文案 / 交互逻辑

| 想改的东西                        | 去哪里                                    |
| --------------------------------- | ----------------------------------------- |
| 所有 UI 文案（导航、按钮、页面标题等） | `src/i18n/lang/zh.ts` / `en.ts`（结构见 `types.ts`）。**不要在组件里硬编码文案** |
| Markdown 插件（目录、折叠等）     | `astro.config.ts` → `markdown`            |
| 明暗切换 / 阅读进度 / 代码复制等脚本 | `src/scripts/theme.ts`、`src/pages/posts/[...slug]/index.astro` 内联脚本 |
