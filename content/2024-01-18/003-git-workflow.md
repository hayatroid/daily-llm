---
date: 2024-01-18
time: '16:45'
title: 'Git Workflow and Branching Strategies'
tags: ['git', 'version-control', 'workflow', 'collaboration']
---

## User

Our team is growing and our Git workflow is getting messy. Different people are using different branching strategies and it's causing conflicts. What's a good Git workflow for a small team?

## Assistant

A consistent Git workflow is essential for team collaboration! Here are the most effective strategies:

### 1. Git Flow (For Release-Based Projects)

```bash
# Main branches
main/master    # Production-ready code
develop        # Integration branch

# Supporting branches
feature/*      # New features
release/*      # Prepare releases
hotfix/*       # Critical production fixes
```

**Workflow:**

```bash
# Start a feature
git checkout develop
git checkout -b feature/user-authentication

# Work on feature, then merge back
git checkout develop
git merge --no-ff feature/user-authentication
git branch -d feature/user-authentication

# Create release
git checkout -b release/1.2.0 develop
# Final testing, bug fixes
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0
```

### 2. GitHub Flow (Simpler, for Continuous Deployment)

```bash
# Only main branch + feature branches
main           # Always deployable
feature/*      # Short-lived feature branches
```

**Workflow:**

```bash
# Create feature branch
git checkout main
git pull origin main
git checkout -b feature/add-search

# Work and push frequently
git add .
git commit -m "Add search functionality"
git push origin feature/add-search

# Open Pull Request → Review → Merge → Deploy
```

### 3. Conventional Commits

```bash
# Format: <type>(<scope>): <description>
feat(auth): add user login functionality
fix(api): resolve 500 error on user creation
docs(readme): update installation instructions
style(css): fix button alignment
refactor(utils): simplify date formatting
test(auth): add login integration tests
chore(deps): update dependencies
```

## User

That's really helpful! What about handling merge conflicts and keeping a clean history? Our commit history is pretty messy right now.

## Assistant

Great question! Clean Git history makes debugging and collaboration much easier:

### 1. Interactive Rebase for Clean History

```bash
# Clean up commits before merging
git rebase -i HEAD~3

# In the editor, you can:
pick a1b2c3d Add user model
squash e4f5g6h Fix typo in user model
squash h7i8j9k Add validation to user model
# Result: One clean commit instead of three
```

### 2. Merge vs. Rebase vs. Squash

```bash
# Merge (preserves history, creates merge commit)
git checkout main
git merge feature/user-auth

# Rebase (rewrites history, linear timeline)
git checkout feature/user-auth
git rebase main
git checkout main
git merge feature/user-auth  # Fast-forward merge

# Squash merge (combines all commits into one)
git checkout main
git merge --squash feature/user-auth
git commit -m "feat: add user authentication"
```

### 3. Handling Merge Conflicts

```bash
# When conflicts occur
git status  # See conflicted files

# Edit conflicted files, look for:
<<<<<<< HEAD
current branch code
=======
incoming branch code
>>>>>>> feature/branch-name

# After resolving conflicts
git add resolved-file.js
git commit  # Or git rebase --continue if rebasing
```

### 4. Best Practices for Clean History

```bash
# Make atomic commits (one logical change per commit)
git add specific-file.js
git commit -m "feat: add user validation"

# Use staging area effectively
git add -p  # Stage hunks interactively

# Amend last commit if needed
git commit --amend -m "Better commit message"

# Force push after rewriting history (careful!)
git push --force-with-lease origin feature/branch
```

### 5. Branch Protection Rules

Set up in GitHub/GitLab:

- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict push to main branch

### 6. Useful Git Aliases

```bash
# Add to ~/.gitconfig
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
    graph = log --oneline --graph --decorate --all
    cleanup = "!git branch --merged | grep -v '\\*\\|main\\|develop' | xargs -n 1 git branch -d"
```

**Key principle:** Keep your main branch stable and your feature branches focused!

Small, frequent commits during development → Clean up with interactive rebase → Merge clean history.
