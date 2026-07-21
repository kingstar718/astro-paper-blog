import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Home",
    posts: "Posts",
    notes: "Notes",
    tags: "Tags",
    about: "About",
    search: "Search",
  },
  post: {
    backToTop: "Back to top",
    goBack: "Go back",
    editPage: "Edit page",
    previousPost: "Previous Post",
    nextPost: "Next Post",
    copy: "Copy",
    copied: "Copied",
    tableOfContents: "Table of Contents",
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
  pages: {
    tagTitle: "Tag",
    tagDesc: "All the articles with the tag",

    tagsTitle: "Tags",

    postsTitle: "Posts",
    postsUnit: "posts",

    notesTitle: "Notes",

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
