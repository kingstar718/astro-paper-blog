import type { UIStrings } from "../types";

export default {
  dateLocale: "zh-cn",
  nav: {
    posts: "文章",
    notes: "短文",
    about: "关于",
    search: "搜索",
  },
  post: {
    copy: "复制",
    copied: "已复制",
    tableOfContents: "目录",
    pinTableOfContents: "固定目录",
    aiGenerated: "本文由 AI 辅助生成",
    updates: {
      title: "更新",
    },
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
  },
  home: {
    allPosts: "全部文章",
    allNotes: "全部短文",
  },
  pages: {
    postsTitle: "文章",
    postsUnit: "篇",
    postsTotal: "共",

    notesTitle: "短文",
    notesUnit: "条",

    searchTitle: "搜索",
  },
  a11y: {
    skipToContent: "跳转到内容",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    toggleTheme: "切换主题",
    goToPreviousPage: "转到上一页",
    goToNextPage: "转到下一页",
  },
  notFound: {
    title: "404 未找到",
    message: "页面未找到",
    goHome: "返回首页",
  },
} satisfies UIStrings;
