export interface UIStrings {
  /**
   * dayjs 的 locale 名，决定日期里星期几等本地化文本的语言。
   * 除 "en"（dayjs 内置）外，新增语言要在 Datetime.astro 里 import 对应的
   * `dayjs/locale/*`，否则 dayjs 会静默退回英文。
   */
  dateLocale: string;
  nav: {
    posts: string;
    notes: string;
    about: string;
    search: string;
  };
  post: {
    copy: string;
    copied: string;
    tableOfContents: string;
    pinTableOfContents: string;
    /** 标题旁 AI 标记的说明文字，作为 tooltip 和无障碍标签使用 */
    aiGenerated: string;
    updates: {
      title: string;
      /** 记录条数的量词，渲染成「3 条」/「3 entries」 */
      unit: string;
    };
  };
  footer: {
    copyright: string;
    allRightsReserved: string;
  };
  home: {
    allPosts: string;
    allNotes: string;
  };
  pages: {
    postsTitle: string;
    postsUnit: string;
    postsTotal: string;

    notesTitle: string;
    notesUnit: string;

    searchTitle: string;
  };
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    goToPreviousPage: string;
    goToNextPage: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
}
