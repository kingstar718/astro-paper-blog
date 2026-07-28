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
 * 内容的唯一日期：发布时写入，实质重写时才更新。
 *
 * 格式与页面上显示的完全一致（`YYYY-MM-DD HH:mm`），按站点时区解读，
 * 因此写 frontmatter 时不用再手算 UTC 偏移——所见即所得。
 *
 * 注意必须加引号：不带引号且带秒的写法会被 YAML 当成时间戳直接转成 Date，
 * 时区解读方式就不受这里控制了。
 */
const pubDatetime = z
  .string({
    error: 'pubDatetime 需要加引号，例如 pubDatetime: "2026-07-28 11:29"',
  })
  .regex(
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
    `pubDatetime 格式应为 "YYYY-MM-DD HH:mm"（${config.site.timezone} 时区）`
  )
  .transform(value => dayjs.tz(value, config.site.timezone).toDate());

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: z.object({
    pubDatetime,
    title: z.string(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    description: z.string(),
    canonicalURL: z.string().optional(),
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
