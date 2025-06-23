# Heading Anchor Links Implementation Plan

## 🎯 Goals

- **見出しクリック機能**: h1/h2/h3をクリックでその位置にアンカーリンク
- **GitHub風UX**: ホバー時に#マーク表示、スムーススクロール対応
- **自動slug生成**: 見出しテキストから適切なURLフラグメント自動生成
- **CLI風デザイン**: 既存のターミナルデザインと調和
- **白文字=クリック可能ルール**: 見出しが白文字なのでクリック可能にして一貫性確保

## 🚫 Non-Goals

- 目次（TOC）自動生成は今回対象外
- 複雑なマークダウン処理変更は避ける
- 外部ライブラリ依存は最小限に

## 📋 Technical Requirements

### **1. Slug Generation**

```javascript
// utils/slugGenerator.js
export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 特殊文字削除
    .replace(/\s+/g, '-') // スペース→ハイフン
    .replace(/^-+|-+$/g, '') // 前後のハイフン除去
    .substring(0, 50); // 長さ制限
}
```

### **2. DOM Processing**

```astro
<!-- Cat.astro -->
<script>
  import { generateSlug } from '../utils/slugGenerator.js';

  // ページロード後に見出し処理
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.file-content h1, .file-content h2, .file-content h3').forEach(heading => {
      const slug = generateSlug(heading.textContent);
      heading.id = slug;
      heading.classList.add('heading-anchor');

      heading.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = slug;
        heading.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  });
</script>
```

### **3. CSS Styling**

```css
/* terminal.css */
.heading-anchor {
  position: relative;
  cursor: pointer;
  scroll-margin-top: var(--space-lg); /* ヘッダー分の余白 */
}

.heading-anchor:hover::before {
  content: '# ';
  color: var(--term-secondary);
  position: absolute;
  left: calc(-1 * var(--char-offset) * 6);
  opacity: 0.7;
}

.heading-anchor:focus {
  outline: 2px solid var(--term-green);
  outline-offset: 2px;
}
```

## 🔧 Implementation Steps

### **Phase 1: Core Infrastructure**

- [x] Create `utils/slugGenerator.js` with slug generation logic
- [x] Add unit tests for slug generation edge cases
- [x] Implement basic anchor functionality in Cat.astro

### **Phase 2: UX Enhancement**

- [x] Add hover effects with # symbol
- [x] Implement smooth scrolling behavior
- [x] Add focus indicators for accessibility

### **Phase 3: Integration & Polish**

- [x] Test across all content types (Japanese/English text)
- [x] Verify mobile responsiveness
- [x] Add CSS variables for consistent theming
- [x] Performance optimization

## 🧪 Test Cases

### **Slug Generation Tests**

```javascript
// Test cases for generateSlug()
"Hello World" → "hello-world"
"APIの設計" → "apiの設計"
"React Hooks (useState)" → "react-hooks-usestate"
"🎯 Goals & Objectives!" → "goals-objectives"
"" → "heading" (fallback)
```

### **User Interaction Tests**

- [ ] h1/h2/h3 click → URL fragment updates
- [ ] Direct URL access → scrolls to correct heading
- [ ] Multiple headings with same text → unique IDs
- [ ] Mobile touch interaction works properly

## 📊 Success Metrics

- **Functionality**: All headings clickable and generate proper anchors
- **Performance**: No noticeable page load impact
- **Accessibility**: Keyboard navigation and screen reader compatible
- **Design**: Seamless integration with existing CLI theme
- **UX**: Hover effects feel responsive and intuitive

## 🔗 Dependencies

- Existing CSS variable system (--term-_, --space-_, etc.)
- Current markdown processing in Cat.astro
- JavaScript ES6+ support in target browsers

## 📝 Notes

- Implementation should preserve existing heading styling (## and ### prefixes)
- Japanese text handling requires careful slug generation
- Consider URL encoding for special characters
- Maintain backward compatibility with existing anchor links

## 📊 Implementation Review

### **✅ Completed Features**

- **Anchor Wrapping**: All h1/h2/h3 headings wrapped with `<a>` tags preserving existing structure
- **Absolute URLs**: Generated anchor links use absolute paths for shareability
- **Slug Generation**: Robust slug generation with Japanese text support and uniqueness handling
- **CSS Optimization**: Removed redundant color declarations leveraging "white text = clickable" rule
- **Smooth Scrolling**: Implemented with proper history management and scroll behavior
- **Testing**: Comprehensive test suite covering edge cases and Japanese text

### **🎯 Key Implementation Decisions**

1. **DOM Manipulation Approach**: Used client-side JavaScript to wrap headings post-render
2. **Absolute URL Strategy**: Generate full absolute URLs for better link sharing
3. **CSS Cascade Optimization**: Removed heading color declarations to leverage global link styles
4. **Unique Slug Handling**: Automatic collision detection with numeric suffixes

### **📈 Performance Metrics**

- **Test Coverage**: 16 test cases covering basic, Japanese, special chars, and edge cases
- **File Structure**: Clean separation with utils/slugGenerator.js for reusability
- **CSS Efficiency**: Reduced CSS declarations by leveraging existing "links are white" rule
- **Browser Compatibility**: ES6+ features with standard DOM APIs

## 📊 Implementation Review

### **✅ Completed Features**

- **Anchor Wrapping**: All h1/h2/h3 headings wrapped with `<a>` tags preserving existing structure
- **Absolute URLs**: Generated anchor links use absolute paths for shareability
- **Slug Generation**: Robust slug generation with Japanese text support and uniqueness handling
- **CSS Optimization**: Removed redundant color declarations leveraging "white text = clickable" rule
- **Smooth Scrolling**: Implemented with proper history management and scroll behavior
- **Testing**: Comprehensive test suite covering edge cases and Japanese text

### **🎯 Key Implementation Decisions**

1. **DOM Manipulation Approach**: Used client-side JavaScript to wrap headings post-render
2. **Absolute URL Strategy**: Generate full absolute URLs for better link sharing
3. **CSS Cascade Optimization**: Removed heading color declarations to leverage global link styles
4. **Unique Slug Handling**: Automatic collision detection with numeric suffixes

### **📈 Performance Metrics**

- **Test Coverage**: 16 test cases covering basic, Japanese, special chars, and edge cases
- **File Structure**: Clean separation with utils/slugGenerator.js for reusability
- **CSS Efficiency**: Reduced CSS declarations by leveraging existing "links are white" rule
- **Browser Compatibility**: ES6+ features with standard DOM APIs
