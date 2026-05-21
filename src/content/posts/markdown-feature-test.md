---
title: Markdown 功能测试 — 中文排版验证
author: 陆上江南
pubDatetime: 2025-05-20T08:00:00Z
modDatetime: 2025-05-21T10:30:00Z
featured: true
draft: false
tags:
  - Markdown
  - 测试
description: 一篇覆盖 Markdown 常用语法的测试文章，同时验证中文排版与主题样式的兼容性。
---

## 引言

这是一篇**功能验证**文章，用来测试 AstroPaper 主题对 Markdown 各语法的渲染效果，以及中文排版的展示质量。如果你能看到这篇内容且排版正常，说明主题运行良好。

> 工欲善其事，必先利其器。一个好的博客主题，应该让写作回归内容本身。

## 文本样式

这段文字包含了 **加粗**、_斜体_、**_加粗斜体_**、~~删除线~~、`行内代码` 和 [超链接](https://astro.build)。

<mark>AstroPaper 默认不支持 `<mark>` 高亮标签，但你可以通过 Tailwind 扩展。</mark>

## 标题层级

### 三级标题

#### 四级标题

##### 五级标题

## 列表

### 无序列表

- 先利其器
- 后利其文
- 再利其思

### 有序列表

1. 第一步：搭建环境
2. 第二步：编写内容
3. 第三步：部署上线

### 任务列表（如果支持）

- [x] 安装 AstroPaper 主题
- [x] 配置中文语言
- [ ] 撰写第一篇文章
- [ ] 部署到服务器

## 代码块

TypeScript 示例：

```ts twoslash
// 计算斐波那契数列
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

带 diff 标注：

```diff
- const oldGreeting = "Hello, World!";
+ const greeting = "你好，世界！";
+ console.log(greeting);
```

Python 示例：

```python
def quick_sort(arr: list) -> list:
    if len(arr) <= 1:
        return arr
    pivot = arr[0]
    left = [x for x in arr[1:] if x <= pivot]
    right = [x for x in arr[1:] if x > pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)
```

## 表格

| 特性 | 状态 | 说明 |
|------|:---:|------|
| 中文排版 | ✅ | 字体间距正常 |
| 代码高亮 | ✅ | 双主题切换正常 |
| 暗色模式 | ✅ | 跟随系统或手动切换 |
| 响应式 | ✅ | 移动端适配良好 |
| RSS | ✅ | 订阅地址 `/rss.xml` |

## 引用

> 书山有路勤为径，学海无涯苦作舟。
>
> — 韩愈《增广贤文》

嵌套引用：

> 第一层引用
>> 第二层引用
>>> 第三层引用

## 数学公式（LaTeX）

行内公式：$E = mc^2$

块级公式：

$$
\int_{a}^{b} f(x) \, dx = F(b) - F(a)
$$

## 分割线

---

## 图片

![示例图片](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80)

上图来自 Unsplash，用于测试外部图片加载。

## 脚注（如果支持）

这里有一个脚注引用[^1]。

[^1]: 这是脚注内容，用于验证脚注渲染是否正常。

## HTML 标签测试

<div align="center">
  <strong>居中文本</strong>
</div>

<details>
<summary>点击展开折叠内容</summary>
这里是隐藏的细节信息，用 HTML `<details>` 标签实现。
</details>

## 结语

以上覆盖了 Markdown 的主要语法和中文排版场景。如果你发现任何样式问题，可以调整 `@tailwindcss/typography` 的配置或修改 `src/styles/typography.css`。

---

> 文章首次发布后进行了内容补充，验证修改日期 `modDatetime` 功能。