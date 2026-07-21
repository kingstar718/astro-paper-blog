import type { UIStrings } from "../types";

export default {
  nav: {
    home: "首页",
    posts: "文章",
    notes: "短文",
    tags: "标签",
    about: "关于",
    search: "搜索",
  },
  post: {
    backToTop: "回到顶部",
    goBack: "返回",
    editPage: "编辑页面",
    previousPost: "上一篇",
    nextPost: "下一篇",
    copy: "复制",
    copied: "已复制",
    tableOfContents: "目录",
  },
  pagination: {
    prev: "上一页",
    next: "下一页",
    page: "第",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
  },
  pages: {
    tagTitle: "标签",
    tagDesc: "所有带有此标签的文章",

    tagsTitle: "标签",

    postsTitle: "文章",
    postsUnit: "篇",

    notesTitle: "短文",

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
