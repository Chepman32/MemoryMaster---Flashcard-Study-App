# Contributing to MemoryMaster

First off, thank you for considering contributing to MemoryMaster! It's people like you that make MemoryMaster such a great tool for learners worldwide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by a code of conduct of respect and professionalism. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (device, OS version, app version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case and motivation**
- **Proposed solution**
- **Alternative solutions** (if any)

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues perfect for newcomers
- `help wanted` - Issues that need community help

## Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/your-username/MemoryMaster---Flashcard-Study-App.git
cd MemoryMaster---Flashcard-Study-App
```

2. **Install dependencies**

```bash
npm install
cd ios && pod install && cd ..
```

3. **Create a branch**

```bash
git checkout -b feature/your-feature-name
```

4. **Start development**

```bash
npm start
npm run ios  # or npm run android
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React Native

- Use functional components with hooks
- Follow React best practices
- Optimize re-renders with `useMemo` and `useCallback` when needed
- Keep components small and focused

### File Organization

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── utils/          # Utility functions
├── constants/      # Constants and configurations
├── types/          # TypeScript type definitions
└── ...
```

### Naming Conventions

- **Components**: PascalCase (e.g., `FlipCard.tsx`)
- **Files**: camelCase (e.g., `spacedRepetition.ts`)
- **Variables**: camelCase (e.g., `cardCount`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_CARDS`)
- **Interfaces/Types**: PascalCase (e.g., `Flashcard`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use trailing commas in multiline objects/arrays
- Maximum line length: 100 characters

Run linter before committing:

```bash
npm run lint
```

### Comments

- Write clear, concise comments for complex logic
- Use JSDoc for functions and classes
- Keep comments up to date with code changes

Example:

```typescript
/**
 * Calculate next review date using SM-2 algorithm
 * @param card - The flashcard being reviewed
 * @param quality - Quality of recall (0-5)
 * @returns Updated card parameters
 */
function calculateNextReview(card: Flashcard, quality: number): SM2Result {
  // Implementation
}
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(study): add swipe gesture support for card reviews

Add support for swipe gestures to rate card difficulty.
- Swipe left for "Again"
- Swipe right for "Easy"
- Swipe up for "Good"
- Swipe down for "Hard"

Closes #123
```

```
fix(database): resolve card duplication issue

Fixed bug where cards were being duplicated when importing
from CSV files with special characters.

Fixes #456
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**

```bash
npm test
```

4. **Update CHANGELOG.md** with your changes
5. **Create pull request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots (for UI changes)
   - Testing instructions

6. **Address review comments**
7. **Squash commits** if requested
8. **Wait for approval** from maintainers

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console warnings
- [ ] Screenshots included (for UI changes)

## Testing

### Unit Tests

```bash
npm test
```

### Type Checking

```bash
npm run typecheck
```

### Running on Device

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

## Questions?

Feel free to:

- Open an issue with the `question` label
- Contact maintainers directly
- Join our community discussions

Thank you for contributing to MemoryMaster! 🎉
