import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://blog.wujinxing.site/",
    title: "陆上江南",
    description: "直道半生如汪洋，付一尾孤航。",
    author: "陆上江南",
    profile: "https://github.com/kingstar718",
    lang: "zh",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/kingstar718/astro-paper-blog/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/kingstar718" },
    { name: "mail",   url: "mailto:kingstar718@foxmail.com" },
  ],
});