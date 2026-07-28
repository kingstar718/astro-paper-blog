import { defineConfig, envField, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [mdx(), sitemap()],
  i18n: {
    locales: ["zh"],
    defaultLocale: "zh",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // constrained 才会给 markdown 里的图片生成 srcset（默认只出一张原尺寸）。
  // 短文主要在手机上读，没有 srcset 就是让手机硬下 1600px 那张去填一个小格子。
  // 图片优化依赖 sharp（devDependency）；真装不上时可退回 passthroughImageService()，
  // 代价是不转 webp、没有 srcset，但宽高与懒加载仍在，构建不会失败。
  image: { layout: "constrained" },
  markdown: {
    // 代码块的语法高亮配色。vitesse 低饱和、偏暖，跟正文的纸感底色是一路的；
    // 换掉原来的 min-light/min-dark——那两个主题的紫、亮蓝、橙饱和度太高，在长段中文里很跳。
    // 底色不取主题自带的，改用 --code-background，见 src/styles/theme.css。
    // 代码块样式见 src/styles/typography.css（.astro-code）。
    shikiConfig: {
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
