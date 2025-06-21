# 🤖 Claude Development Guide

## 📝 Commit Rules

### Commit Message Format
```
<type>: <description>

[optional body]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

### Examples
- `feat: add daily conversation recording`
- `docs: create project overview`
- `fix: correct markdown formatting`

### Guidelines
1. Use present tense ("add" not "added")
2. Keep first line under 50 characters
3. Capitalize first letter
4. No period at the end of subject line
5. Use imperative mood ("add" not "adds")

## 🚀 Project Specific Notes

### Directory Structure
- All conversations go in `content/YYYY-MM-DD/`
- Name files as `001-[topic].md`, `002-[topic].md`, etc.
- Daily summaries saved as `summary.md`

### Documentation
- Project specs in `docs/001-project-overview.md`
- Technical details in separate numbered docs
