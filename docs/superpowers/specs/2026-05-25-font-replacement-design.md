# Font Replacement: Noto Sans SC + Inter + Google Sans Code

## Summary

Replace the single Noto Serif SC (10.7 MB) with three local fonts:
- **Noto Sans SC** (subsetted, ~1.5 MB) — Chinese body text
- **Inter** (~100 KB) — English/number body text, weight 400 + 700
- **Google Sans Code** (~100 KB) — code blocks, weight 400

All fonts loaded locally from `public/fonts/`, no external CDN dependency.

## Current State

- `public/fonts/noto-serif-sc.woff2` (10.7 MB)
- `src/styles/fonts.css` — single `@font-face` rule
- `src/styles/theme.css` — `--font-app: "Noto Serif SC", "PingFang SC", ...`
- Stale cache in `.astro/fonts/` from previous Astro font system usage

## Target State

### Font files in `public/fonts/`

| File | Font | Weight | Size (est.) |
|---|---|---|---|
| `noto-sans-sc-subset.woff2` | Noto Sans SC | 400 | ~1.5 MB |
| `inter-400.woff2` | Inter | 400 | ~50 KB |
| `inter-700.woff2` | Inter | 700 | ~50 KB |
| `google-sans-code-400.woff2` | Google Sans Code | 400 | ~100 KB |

### `src/styles/fonts.css`

```
@font-face {
  font-family: "Noto Sans SC";
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/noto-sans-sc-subset.woff2") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/inter-400.woff2") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/inter-700.woff2") format("woff2");
}
@font-face {
  font-family: "Google Sans Code";
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/google-sans-code-400.woff2") format("woff2");
}
```

### `src/styles/theme.css`

- `--font-app`: `"Noto Sans SC", "Inter", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif`
- `--font-code`: `"Google Sans Code", ui-monospace, "Cascadia Code", "Source Code Pro", monospace`

### Code block font

Add `--font-code` CSS variable and apply it to `<code>` / `<pre>` elements via Tailwind config or global CSS.

### Remove

- `public/fonts/noto-serif-sc.woff2`
- `.astro/fonts/` directory

## Noto Sans SC Subsetting

Use `fonttools pyftsubset` to shrink from ~10 MB to ~1.5 MB.

Characters to include:
- Common Chinese characters (现代汉语常用字表: 3500 chars)
- Full-width punctuation and symbols
- Characters found in existing blog content
- Latin subset (for numbers and mixed text)

Command pattern:
```
pyftsubset noto-sans-sc.woff2 \
  --unicodes=<char-unicode-list> \
  --output-file=noto-sans-sc-subset.woff2 \
  --flavor=woff2
```

## Font Sources

| Font | License | Source |
|---|---|---|
| Noto Sans SC | OFL | Google Fonts / GitHub |
| Inter | OFL | Google Fonts / rsms.me |
| Google Sans Code | OFL | GitHub: googlefonts/glyphsets |

## Risk: Font Availability

- **Google Sans Code** may not have a dedicated woff2 download. If unavailable, fallback to **JetBrains Mono** (also monospace, OFL, widely available).
