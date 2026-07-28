import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: z.object({
    /** 内容的唯一日期：发布时写入，后续修改也更新它 */
    pubDatetime: z.date(),
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
    pubDatetime: z.date(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { posts, pages, notes };
