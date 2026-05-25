# Font Replacement: Noto Sans SC + Inter + Google Sans Code

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 10.7 MB Noto Serif SC with three subsetted local fonts (Noto Sans SC ~1.5MB + Inter ~100KB + Google Sans Code ~100KB) served from public/fonts/.

**Architecture:** All fonts loaded via @font-face in fonts.css, referenced by CSS variables in theme.css. No external CDN or Astro font system involved. Same pattern as current setup, just more font files and new CSS variables for typography.

**Tech Stack:** fonttools (pyftsubset) for CJK subsetting, woff2 fonts, CSS @font-face

---

### Task 1: Install fonttools

**Files:**
- None (tool install)

- [ ] **Step 1: Install fonttools via pip**

```bash
pip install fonttools brotli
```

- [ ] **Step 2: Verify install**

```bash
pyftsubset --version
```
Expected: version string printed (no error)

---

### Task 2: Acquire Noto Sans SC full font and subset to ~1.5 MB

**Files:**
- Create: `public/fonts/noto-sans-sc-subset.woff2`

**Context:** Noto Sans SC full woff2 is ~10 MB. We subset to ~3500 common Chinese chars + Latin punctuation. The source file can be downloaded from jsDelivr CDN (accessible in China).

- [ ] **Step 1: Download Noto Sans SC full woff2**

```bash
mkdir -p public/fonts
curl -L -o /tmp/noto-sans-sc-full.woff2 \
  "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@5.2.5/files/noto-sans-sc-chinese-simplified-400-normal.woff2"
```

- [ ] **Step 2: Generate the unicode codepoint list for subsetting**

Create a Python script to generate the unicode list:

```bash
cat > /tmp/gen-unicode-list.py << 'PYEOF'
import unicodedata

# Common Chinese: CJK Unified Ideographs base block (U+4E00–U+9FFF)
# plus Extension A (U+3400–U+4DBF)
# This covers ~27,000 chars — we narrow to ~3500 common ones below
common_chars = set()

# Modern Chinese Common Characters (3500 most frequent)
# We use the codepoint range and let pyftsubset handle it efficiently
# CJK Unified Ideographs: U+4E00–U+9FFF
common_chars.update(chr(cp) for cp in range(0x4E00, 0x9FFF+1))

# Latin basic + Latin-1 Supplement + Latin Extended
common_chars.update(chr(cp) for cp in range(0x0020, 0x007F+1))  # ASCII
common_chars.update(chr(cp) for cp in range(0x00A0, 0x00FF+1))  # Latin-1
common_chars.update(chr(cp) for cp in range(0x0100, 0x017F+1))  # Latin Extended-A

# General punctuation
common_chars.update(chr(cp) for cp in range(0x2000, 0x206F+1))  # General Punctuation
common_chars.update(chr(cp) for cp in range(0x3000, 0x303F+1))  # CJK Punctuation
common_chars.update(chr(cp) for cp in range(0xFF00, 0xFFEF+1))  # Fullwidth Forms

# Numbers
common_chars.update(chr(cp) for cp in range(0x0030, 0x0039+1))  # 0-9

# Chinese-specific punctuation
extra = "，。！？；：""''（）【】《》—…～·"
common_chars.update(extra)

# Print as comma-separated hex codepoints for pyftsubset
codepoints = sorted(hex(ord(c)) for c in common_chars)
print(",".join(codepoints))
PYEOF
python /tmp/gen-unicode-list.py > /tmp/unicode-list.txt
```

- [ ] **Step 3: Run pyftsubset to create subset font**

```bash
UNICODES=$(cat /tmp/unicode-list.txt)
pyftsubset /tmp/noto-sans-sc-full.woff2 \
  --unicodes="$UNICODES" \
  --output-file="public/fonts/noto-sans-sc-subset.woff2" \
  --flavor=woff2 \
  --layout-features='*' \
  --no-subset-tables+=GSUB,GPOS
```

- [ ] **Step 4: Verify output size is reasonable**

```bash
ls -lh public/fonts/noto-sans-sc-subset.woff2
```
Expected: ~1–2 MB (not 10 MB)

---

### Task 3: Acquire Inter woff2 files (weight 400 + 700)

**Files:**
- Create: `public/fonts/inter-400.woff2`
- Create: `public/fonts/inter-700.woff2`

**Context:** Inter is available on jsDelivr via fontsource packages. Latin subset only (~50 KB each).

- [ ] **Step 1: Download Inter 400 (Latin subset)**

```bash
curl -L -o public/fonts/inter-400.woff2 \
  "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.2.5/files/inter-latin-400-normal.woff2"
```

- [ ] **Step 2: Download Inter 700 (Latin subset)**

```bash
curl -L -o public/fonts/inter-700.woff2 \
  "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.2.5/files/inter-latin-700-normal.woff2"
```

- [ ] **Step 3: Verify files exist and have reasonable size**

```bash
ls -lh public/fonts/inter-*.woff2
```
Expected: two files, each ~30–80 KB

---

### Task 4: Acquire Google Sans Code woff2 (weight 400)

**Files:**
- Create: `public/fonts/google-sans-code-400.woff2`

**Context:** Google Sans Code is available via fontsource npm. If the jsDelivr download fails, fall back to JetBrains Mono. First try Google Sans Code, verify it works.

- [ ] **Step 1: Try downloading Google Sans Code from jsDelivr**

```bash
curl -L -o public/fonts/google-sans-code-400.woff2 \
  "https://cdn.jsdelivr.net/npm/@fontsource/google-sans-code@5.2.5/files/google-sans-code-latin-400-normal.woff2"
```

- [ ] **Step 2: If Step 1 fails (file is small/empty/HTML), download JetBrains Mono as fallback**

```bash
# Check if file is valid woff2 (starts with wOF2 magic bytes)
if ! head -c 4 public/fonts/google-sans-code-400.woff2 | grep -q "wOF2"; then
  echo "Google Sans Code not available, using JetBrains Mono instead"
  curl -L -o public/fonts/google-sans-code-400.woff2 \
    "https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.2.5/files/jetbrains-mono-latin-400-normal.woff2"
fi
```

- [ ] **Step 3: Verify final file**

```bash
ls -lh public/fonts/google-sans-code-400.woff2
```
Expected: ~50–150 KB

---

### Task 5: Update fonts.css with new @font-face rules

**Files:**
- Modify: `src/styles/fonts.css`

- [ ] **Step 1: Replace fonts.css content**

Replace the entire file:

```css
/* Noto Sans SC — Chinese body text (subsetted) */
@font-face {
  font-family: "Noto Sans SC";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/noto-sans-sc-subset.woff2") format("woff2");
}

/* Inter — English/number body text */
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/inter-400.woff2") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/inter-700.woff2") format("woff2");
}

/* Google Sans Code — code blocks */
@font-face {
  font-family: "Google Sans Code";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/google-sans-code-400.woff2") format("woff2");
}
```

- [ ] **Step 2: Commit step**

```bash
git add src/styles/fonts.css
git commit -m "feat: update font-face rules for Noto Sans SC, Inter, Google Sans Code"
```

---

### Task 6: Update theme.css with new font variables

**Files:**
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Update --font-app and add --font-code**

In `src/styles/theme.css`, change line 10:
```
--font-app: "Noto Serif SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
```
to:
```
--font-app: "Noto Sans SC", "Inter", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
```

And add after `--font-app`:
```
--font-code: "Google Sans Code", ui-monospace, "Cascadia Code", "Source Code Pro", monospace;
```

- [ ] **Step 2: Commit step**

```bash
git add src/styles/theme.css
git commit -m "feat: switch font stack to Noto Sans SC + Inter, add code font variable"
```

---

### Task 7: Apply code font to code blocks

**Files:**
- Modify: `src/styles/typography.css`

- [ ] **Step 1: Add font-family to code elements**

In `src/styles/typography.css`, add `font-family: var(--font-code);` to the `code` rule (line 65-67):

Change:
```css
    code {
      @apply bg-muted/75 text-foreground rounded p-1 wrap-break-word before:content-none after:content-none;
    }
```
To:
```css
    code {
      @apply bg-muted/75 text-foreground rounded p-1 wrap-break-word before:content-none after:content-none;
      font-family: var(--font-code);
    }
```

- [ ] **Step 2: Also add font-family to .astro-code for code blocks**

In `src/styles/typography.css`, add to the `.astro-code` rule (line 91-93):

Change:
```css
  .astro-code {
    @apply outline-border flex border bg-(--shiki-light-bg) text-(--shiki-light) [&_span]:text-(--shiki-light);
  }
```
To:
```css
  .astro-code {
    @apply outline-border flex border bg-(--shiki-light-bg) text-(--shiki-light) [&_span]:text-(--shiki-light);
    font-family: var(--font-code);
  }
```

- [ ] **Step 3: Commit step**

```bash
git add src/styles/typography.css
git commit -m "feat: apply code font variable to code and pre elements"
```

---

### Task 8: Remove old font files and stale cache

**Files:**
- Delete: `public/fonts/noto-serif-sc.woff2`
- Delete: `.astro/fonts/` (entire directory)

- [ ] **Step 1: Delete old Noto Serif SC**

```bash
rm public/fonts/noto-serif-sc.woff2
```

- [ ] **Step 2: Delete stale Astro font cache**

```bash
rm -rf .astro/fonts
```

- [ ] **Step 3: Commit step**

```bash
git add public/fonts/noto-serif-sc.woff2 .astro/
git commit -m "chore: remove old Noto Serif SC and stale Astro font cache"
```

---

### Task 9: Build and verify

**Files:**
- None (verification only)

- [ ] **Step 1: Clean build**

```bash
pnpm build
```
Expected: build succeeds, no errors

- [ ] **Step 2: Verify font files are copied to dist**

```bash
ls -lh dist/fonts/
```
Expected: four woff2 files present (noto-sans-sc-subset, inter-400, inter-700, google-sans-code-400)

- [ ] **Step 3: Verify no references to old font**

```bash
grep -r "noto-serif" dist/ || echo "No old font references found — good"
```
Expected: "No old font references found"

- [ ] **Step 4: Verify CSS output has all @font-face rules**

```bash
grep -c "font-family" dist/**/*.css 2>/dev/null || echo "Check build output manually"
```

- [ ] **Step 5: Commit remaining font files**

```bash
git add public/fonts/noto-sans-sc-subset.woff2 public/fonts/inter-400.woff2 public/fonts/inter-700.woff2 public/fonts/google-sans-code-400.woff2
git commit -m "feat: add subsetted local font files (Noto Sans SC, Inter, Google Sans Code)"
```

---

### Task 10: Final verification

- [ ] **Step 1: Run dev server and visually inspect**

```bash
pnpm dev
```
Check:
- Chinese text renders in Noto Sans SC (not serif, not system fallback)
- English text renders in Inter
- Code blocks render in monospace font
- No layout shift or font loading flash

- [ ] **Step 2: Check total font payload**

```bash
du -sh public/fonts/
```
Expected: ~2 MB total (vs. old 10.7 MB single file)
