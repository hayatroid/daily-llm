# Dark Theme Toggle Implementation Plan

## 🎯 Goals

- [ ] Add light/dark theme toggle functionality
- [ ] Persist user's theme preference using localStorage
- [ ] Create smooth theme transitions
- [ ] Add toggle button to the header
- [ ] Support system theme preference as default

## 🚫 Non-Goals

- Complex theme variations (e.g., multiple color schemes)
- Server-side theme rendering
- Theme-specific images or assets
- Accessibility features beyond basic contrast requirements
- Custom theme creation by users

## 📋 Implementation Details

### 1. CSS Architecture

- [ ] Define CSS custom properties for both light and dark themes
- [ ] Use `data-theme` attribute on `<html>` element
- [ ] Implement smooth transitions for theme changes

### 2. Theme Toggle Component

- [ ] Create Astro component for theme toggle button
- [ ] Use moon/sun icons for visual indication
- [ ] Position in header for consistent access

### 3. JavaScript Implementation

- [ ] Add client-side script to BaseLayout.astro
- [ ] Implement theme switching logic
- [ ] Save preference to localStorage
- [ ] Load saved preference on page load
- [ ] Detect system theme preference as fallback

### 4. Color Schemes

#### Dark Theme (Current)

- Background: `#0a0a0a`
- Primary: `#ffffff`
- Secondary: `#999999`
- Accent: `#00ff00`

#### Light Theme (New)

- Background: `#ffffff`
- Primary: `#0a0a0a`
- Secondary: `#666666`
- Accent: `#008800`

### 5. Testing Checklist

- [ ] Theme persists across page reloads
- [ ] Theme persists across different pages
- [ ] No flash of incorrect theme on load
- [ ] Smooth transitions between themes
- [ ] Proper contrast ratios in both themes

## 🔧 Technical Considerations

- Use CSS-only solution where possible
- Minimize JavaScript for performance
- Prevent FOUC (Flash of Unstyled Content)
- Ensure compatibility with Astro's static generation

## 📊 Success Metrics

- Theme toggle works instantly
- No visual glitches during transition
- User preference is remembered
- Both themes meet accessibility standards
