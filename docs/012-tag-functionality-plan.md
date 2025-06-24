# 🏷️ Tag Functionality Implementation Plan

## 🎯 Goals

- **Tag-based Navigation**: Click tags to navigate to tag-specific conversation listings
- **Consistent UI**: Use exact same layout/structure as existing date-based pages
- **Tree Display**: Show conversations grouped by date within tag pages
- **URL Structure**: `/tags/{tag}` routing pattern
- **Responsive Design**: Maintain mobile-friendly terminal aesthetics

## 🚫 Non-Goals

- Tag analytics or statistics (defer for future)
- Tag renaming/editing interface (content-only changes)
- Tag hierarchies or categories (flat tag structure only)
- Search within tags (basic tag filtering only)

## 📋 Implementation Tasks

### [ ] 1. Create Tag Page Routing

- Add `/src/pages/tags/[tag].astro`
- Implement `getStaticPaths()` for all unique tags
- Extract tags from all conversation frontmatter

### [ ] 2. Data Processing & Filtering

- Create utility function to collect all unique tags
- Filter conversations by specific tag
- Group filtered conversations by date (maintain chronological structure)

### [ ] 3. UI Components & Layout

- Reuse existing `Tree.astro` component for conversation listing
- Adapt `Pwd.astro` for tag navigation context
- Create tag-specific title and navigation

### [ ] 4. Tag Link Enhancement

- Make tags in `Cat.astro` clickable (link to `/tags/{tag}`)
- Ensure proper URL encoding for tag names
- Maintain existing tag styling with added hover/click states

### [ ] 5. Navigation Integration

- Add "cd ../" navigation back to home from tag pages
- Update `Pwd.astro` to show tag context paths
- Ensure consistent navigation patterns

## 🏗️ Technical Architecture

### URL Structure

```
/                           # Home (all dates)
/{date}/                    # Date page (conversations for date)
/{date}/{conversation}      # Individual conversation
/tags/{tag}                 # NEW: Tag page (conversations with tag)
```

### Data Flow

```astro
// 1. Collect all tags from frontmatter
const allTags = [...new Set(allContent.flatMap(file => file.frontmatter.tags || []))];

// 2. Filter conversations by tag
const taggedConversations = allContent.filter(file =>
  file.frontmatter.tags?.includes(targetTag)
);

// 3. Group by date for tree display
const dateGroups = groupConversationsByDate(taggedConversations);
```

### Component Reuse Strategy

- **Tree.astro**: Extend props to handle tag-grouped data
- **Cat.astro**: Add click handlers to tag spans
- **Pwd.astro**: Add tag context display mode
- **BaseLayout.astro**: No changes needed

## 📱 Page Structure (Mirroring Existing)

```astro
<BaseLayout title="Tag: {tag}">
  <Pwd currentPage="tag" tagName={tag} />

  <!-- Tag summary display (similar to date summary) -->
  <div class="tag-header">
    <h1>#{tag}</h1>
    <span class="meta">{conversationCount} conversations</span>
  </div>

  <!-- Tree listing by date -->
  <div class="tree-session">
    <Prompt command="tree" />
    <TagTree conversations={groupedConversations} tag={tag} />
  </div>

  <!-- Navigation -->
  <Prompt command="cd ../" href="/" />
</BaseLayout>
```

## 🎨 Visual Design

### Tag Display Enhancement

```css
.tag-link {
  cursor: pointer;
  transition: color 0.2s ease;
}

.tag-link:hover {
  color: var(--term-amber);
  text-decoration: underline;
}
```

### Tree Display for Tags

- Group conversations by date (newest first)
- Show date folders with conversation counts
- Maintain exact same tree visual hierarchy
- Include time metadata for each conversation

## 🔄 Integration Points

1. **Tag Extraction**: Scan all `content/**/*.md` frontmatter
2. **URL Generation**: Use existing slug utilities for consistency
3. **Navigation**: Extend Pwd component for tag context
4. **Styling**: Reuse existing terminal CSS patterns

## ⚡ Performance Considerations

- **Static Generation**: Pre-generate all tag pages at build time
- **Caching**: Leverage Astro's static site generation
- **Bundle Size**: Reuse existing components (no additional JS)

## 🧪 Testing Strategy

- [ ] Verify all unique tags generate pages
- [ ] Test tag click navigation
- [ ] Ensure responsive design on mobile
- [ ] Validate URL encoding for special characters in tags
- [ ] Check tree hierarchy displays correctly

## 📈 Success Metrics

- [ ] All existing tags are clickable and navigate correctly
- [ ] Tag pages display identical layout to date pages
- [ ] Tree structure groups conversations by date within tags
- [ ] Navigation breadcrumbs work consistently
- [ ] Mobile responsiveness maintained
