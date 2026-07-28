import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import config from "@/config";

dayjs.extend(utc);
dayjs.extend(timezone);

export const BLOG_PATH = "src/content/posts";

/**
 * 全站统一的日期字段。
 *
 * 格式与页面上显示的完全一致（`YYYY-MM-DD HH:mm`），按站点时区解读，
 * 因此写 frontmatter 时不用再手算 UTC 偏移——所见即所得。
 *
 * 注意必须加引号：不带引号且带秒的写法会被 YAML 当成时间戳直接转成 Date，
 * 时区解读方式就不受这里控制了。
 */
const datetime = (field: string) =>
  z
    .string({
      error: `${field} 需要加引号，例如 ${field}: "2026-07-28 11:29"`,
    })
    .regex(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
      `${field} 格式应为 "YYYY-MM-DD HH:mm"（${config.site.timezone} 时区）`
    )
    .transform(value => dayjs.tz(value, config.site.timezone).toDate());

/** 内容的唯一日期：发布时写入，只有实质重写才更新——日常修改的痕迹由 updates 承载 */
const pubDatetime = datetime("pubDatetime");

/**
 * 文末的更新记录。它是元数据而不是正文，所以放在 frontmatter 里由组件渲染：
 * 字段能被 schema 校验、样式统一可控，也不会被 pagefind 当作正文索引进搜索结果。
 */
const updates = z
  .array(
    z.object({
      datetime: datetime("updates[].datetime"),
      action: z.enum(["创建", "修改", "排版", "翻译"]),
      note: z.string().min(1, "updates[].note 不能为空，要写清具体改了什么"),
      agent: z.string(),
    })
  )
  .optional();

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: z.object({
    pubDatetime,
    title: z.string(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    // 时间线上每条只给一行：超过 45 字在 768px 的正文宽度里就会折行，
    // 几篇叠在一起首页就糊成一片。写不下说明还没提炼到位。
    description: z
      .string()
      .max(45, "description 控制在 45 字以内，时间线上只占一行"),
    canonicalURL: z.string().optional(),
    // 正文由 AI 辅助生成。标记只渲染在标题旁边，不写进 title 字符串，
    // 因此 <title>、RSS 标题和搜索索引都不受影响。
    // 不设默认值：真人写的和 AI 写的都要显式表态，避免默认值把哪一边标错。
    aiGenerated: z.boolean().optional(),
    updates,
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

// 短文：正文一两段，直接在列表里展开，不单独生成详情页，因此没有标题
const notes = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/notes" }),
  schema: z.object({
    pubDatetime,
    draft: z.boolean().optional(),
  }),
});

export const collections = { posts, pages, notes };
