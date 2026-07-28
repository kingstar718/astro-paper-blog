// 这里只放"站点级"设置。主题色、字体、代码高亮、文案等在别处，
// 不确定改哪个文件时看 README 的「配置地图」。
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
  // perIndex 是首页各取几条，perPage 是列表页每页几条。
  // 列表页是「翻完整个站」的地方，要明显多于首页那几条摘要。
  posts: {
    perPage: 10,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  notes: {
    // 短文在列表里是全文展开的，比文章占竖向空间，所以没给更大
    perPage: 15,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/kingstar718" },
    { name: "mail",   url: "mailto:kingstar718@foxmail.com" },
  ],
});