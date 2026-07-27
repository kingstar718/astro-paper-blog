import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Home",
    posts: "Posts",
    notes: "Notes",
    about: "About",
    search: "Search",
  },
  post: {
    copy: "Copy",
    copied: "Copied",
    tableOfContents: "Table of Contents",
    pinTableOfContents: "Pin table of contents",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
    page: "Page",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
  },
  home: {
    allPosts: "All posts",
    allNotes: "All notes",
  },
  pages: {
    postsTitle: "Posts",
    postsUnit: "posts",
    postsTotal: "Total",

    notesTitle: "Notes",
    notesUnit: "notes",

    searchTitle: "Search",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle theme",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
  },
  notFound: {
    title: "404 Not Found",
    message: "Page Not Found",
    goHome: "Go back home",
  },
} satisfies UIStrings;
