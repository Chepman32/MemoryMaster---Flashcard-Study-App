# MemoryMaster - Flashcard Study App

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A production-ready, gesture-driven flashcard application with advanced spaced repetition, 3D card flipping animations, and rich content support.

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Architecture](#architecture) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Spaced Repetition Algorithm](#spaced-repetition-algorithm)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Features

- **🎴 Smart Flashcards**: Create, edit, and organize flashcards with text, images, and audio
- **🧠 Spaced Repetition**: SM-2 algorithm for optimal learning and retention
- **📊 Detailed Statistics**: Track your progress with comprehensive analytics
- **🎨 Beautiful UI**: Modern, intuitive interface with smooth animations
- **🌙 Dark Mode**: Full dark mode support for comfortable studying
- **📱 Offline First**: 100% offline functionality with SQLite database
- **🔄 Import/Export**: CSV and JSON support for deck sharing

### Study Features

- **Multiple Study Modes**:
  - Smart Study (due cards + new cards)
  - Practice All (random review)
  - Cram Mode (quick review)

- **Gesture Controls**:
  - Swipe left: Again (didn't know)
  - Swipe right: Easy (knew immediately)
  - Swipe up: Good (knew with thought)
  - Swipe down: Hard (struggled)
  - Tap to flip cards

- **3D Card Animations**: Realistic flip animations with perspective
- **Progress Tracking**: Real-time session statistics and XP system
- **Adaptive Scheduling**: Cards scheduled based on your performance

### Advanced Features

- **Rich Text Support**: Format card content with markdown
- **Tagging System**: Organize cards with custom tags
- **Deck Colors**: Customize deck appearance with color themes
- **Study Streaks**: Track daily study habits
- **Session History**: Review past study sessions
- **Retention Analytics**: Monitor your learning effectiveness

---

## 📸 Screenshots

*Coming soon - Add screenshots of key screens*

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- React Native CLI
- Xcode (for iOS) or Android Studio (for Android)
- CocoaPods (for iOS)

### Clone the Repository

```bash
git clone https://github.com/yourusername/MemoryMaster---Flashcard-Study-App.git
cd MemoryMaster---Flashcard-Study-App
```

### Install Dependencies

```bash
npm install
```

### iOS Setup

```bash
cd ios
pod install
cd ..
```

### Run the App

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

---

## 💻 Development

### Start Metro Bundler

```bash
npm start
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── animated/       # Animated components (FlipCard, SwipeableCard, etc.)
│   ├── deck/           # Deck-related components
│   ├── editor/         # Card editor components
│   └── common/         # Common UI components
│
├── screens/            # App screens
│   ├── splash/         # Splash screen
│   ├── home/           # Home dashboard
│   ├── study-session/  # Study session screens
│   ├── deck-details/   # Deck detail view
│   ├── card-editor/    # Card creation/editing
│   ├── statistics/     # Statistics and analytics
│   ├── settings/       # App settings
│   └── premium/        # Premium features (future)
│
├── database/           # SQLite database
│   ├── database.ts     # Database initialization and operations
│   ├── schemas/        # Table schemas
│   └── queries/        # SQL queries
│
├── algorithms/         # Core algorithms
│   └── spacedRepetition.ts  # SM-2 implementation
│
├── store/              # State management
│   └── useStore.ts     # Zustand store
│
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
│
├── utils/              # Utility functions
│   ├── importExport.ts # Import/Export functionality
│   └── sampleData.ts   # Sample data generation
│
├── constants/          # App constants
│   └── theme.ts        # Theme and styling constants
│
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
│
└── App.tsx             # Root component
```

---

## 🛠 Technologies

### Core

- **React Native 0.73**: Cross-platform mobile framework
- **TypeScript 5.3**: Type-safe JavaScript
- **React Navigation 6**: Navigation library

### Animation & Graphics

- **React Native Reanimated 3**: Performant animations
- **React Native Skia**: 2D graphics rendering
- **React Native Gesture Handler**: Gesture recognition

### State & Storage

- **Zustand**: Lightweight state management
- **SQLite**: Local database
- **AsyncStorage**: Persistent storage

### UI & Styling

- **React Native Vector Icons**: Icon library
- **Custom theme system**: Consistent styling

---

## 🏗 Architecture

### Design Patterns

- **Component-Based Architecture**: Modular, reusable components
- **Container/Presenter Pattern**: Separation of logic and UI
- **Repository Pattern**: Database abstraction
- **Observer Pattern**: State management with Zustand

### Data Flow

```
User Interaction
    ↓
Screen Component
    ↓
Store (Zustand) ←→ Database (SQLite)
    ↓
Algorithm (SM-2)
    ↓
Updated UI
```

### Database Schema

#### Decks Table
```sql
CREATE TABLE decks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  totalCards INTEGER DEFAULT 0,
  newCards INTEGER DEFAULT 0,
  learningCards INTEGER DEFAULT 0,
  reviewCards INTEGER DEFAULT 0,
  masteredCards INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

#### Cards Table
```sql
CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  deckId TEXT NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  hint TEXT,
  cardType TEXT NOT NULL,
  easeFactor REAL DEFAULT 2.5,
  interval INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  dueDate TEXT NOT NULL,
  state TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (deckId) REFERENCES decks (id)
);
```

#### Sessions Table
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  deckId TEXT NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT,
  cardsStudied INTEGER DEFAULT 0,
  againCount INTEGER DEFAULT 0,
  hardCount INTEGER DEFAULT 0,
  goodCount INTEGER DEFAULT 0,
  easyCount INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0,
  xpEarned INTEGER DEFAULT 0,
  FOREIGN KEY (deckId) REFERENCES decks (id)
);
```

---

## 🧠 Spaced Repetition Algorithm

MemoryMaster uses the **SM-2 (SuperMemo 2)** algorithm for optimal spaced repetition.

### Key Concepts

- **Ease Factor (EF)**: Difficulty multiplier (1.3 - 2.5)
- **Interval**: Days until next review
- **Repetitions**: Number of successful reviews

### Algorithm Flow

```typescript
If quality < 3 (Failed):
  - Reset repetitions to 0
  - Set interval to 1 day
  - Decrease ease factor

If quality >= 3 (Passed):
  - Increment repetitions
  - Calculate new interval:
    * First review: 1 day
    * Second review: 6 days
    * Subsequent: Previous interval × Ease Factor
  - Adjust ease factor based on difficulty
```

### Card States

1. **New**: Never studied
2. **Learning**: Short intervals (minutes to days)
3. **Young**: Interval < 21 days
4. **Mature**: Interval >= 21 days
5. **Relearning**: Failed review of mature card

### Interval Calculation

```typescript
function calculateNextReview(card, quality) {
  let newEF = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEF = Math.max(1.3, Math.min(2.5, newEF));

  if (quality < 3) {
    return { interval: 1, repetitions: 0, easeFactor: newEF };
  }

  let interval;
  if (card.repetitions === 0) interval = 1;
  else if (card.repetitions === 1) interval = 6;
  else interval = Math.round(card.interval * newEF);

  return {
    interval,
    repetitions: card.repetitions + 1,
    easeFactor: newEF,
  };
}
```

---

## 📚 API Documentation

### Database API

#### Deck Operations

```typescript
// Create a new deck
await database.createDeck(deck: Deck): Promise<void>

// Get all decks
await database.getAllDecks(): Promise<Deck[]>

// Get deck by ID
await database.getDeck(id: string): Promise<Deck | null>

// Update deck
await database.updateDeck(deck: Deck): Promise<void>

// Delete deck
await database.deleteDeck(id: string): Promise<void>
```

#### Card Operations

```typescript
// Create a new card
await database.createCard(card: Flashcard): Promise<void>

// Get cards by deck
await database.getCardsByDeck(deckId: string): Promise<Flashcard[]>

// Update card
await database.updateCard(card: Flashcard): Promise<void>

// Delete card
await database.deleteCard(id: string): Promise<void>
```

#### Session Operations

```typescript
// Create study session
await database.createSession(session: StudySession): Promise<void>

// Get sessions by deck
await database.getSessionsByDeck(deckId: string): Promise<StudySession[]>
```

### Store API

```typescript
// Access store
const { decks, cards, settings, updateSettings } = useStore();

// Update settings
updateSettings({ theme: 'dark' });

// Manage decks
addDeck(deck);
updateDeck(deck);
removeDeck(deckId);

// Manage cards
addCard(card);
updateCard(card);
removeCard(cardId);
```

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Test Files

- `__tests__/algorithms/spacedRepetition.test.ts`
- `__tests__/database/database.test.ts`
- `__tests__/components/FlipCard.test.tsx`
- `__tests__/utils/importExport.test.ts`

---

## 🚢 Deployment

### iOS Deployment

1. Configure signing in Xcode
2. Update version in `Info.plist`
3. Archive and upload to App Store Connect

```bash
cd ios
fastlane beta  # Deploy to TestFlight
```

### Android Deployment

1. Generate release keystore
2. Update version in `build.gradle`
3. Build release APK/AAB

```bash
cd android
./gradlew assembleRelease
```

---

## 📖 Usage Guide

### Creating Your First Deck

1. Open the app
2. Tap the "+" button or "Create Deck"
3. Enter deck name and description
4. Choose a color theme
5. Tap "Save"

### Adding Cards

1. Open a deck
2. Tap "Add Card"
3. Enter front (question) and back (answer)
4. Optionally add a hint
5. Tap "Save"

### Studying

1. Open a deck
2. Tap "Study Now"
3. Read the question and try to recall the answer
4. Tap to flip the card
5. Rate your answer:
   - **Again**: Didn't know it
   - **Hard**: Barely remembered
   - **Good**: Knew it with some thought
   - **Easy**: Knew it immediately

### Using Swipe Gestures

Enable in Settings → Swipe Gestures

- **Swipe Left**: Again
- **Swipe Right**: Easy
- **Swipe Up**: Good
- **Swipe Down**: Hard

### Importing Decks

1. Go to Settings → Import
2. Select CSV or JSON file
3. Review imported cards
4. Choose destination deck
5. Confirm import

### Exporting Decks

1. Open a deck
2. Tap menu (⋮) → Export
3. Choose format (CSV or JSON)
4. Share or save file

---

## 🎯 Future Features

- [ ] Cloud sync across devices
- [ ] Collaborative decks
- [ ] AI-generated cards
- [ ] Image occlusion
- [ ] Audio recording
- [ ] Anki import
- [ ] Quizlet import
- [ ] Study reminders
- [ ] Gamification (badges, achievements)
- [ ] Study groups
- [ ] Public deck marketplace

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow the existing code style
- Use meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- SuperMemo for the SM-2 algorithm
- React Native community
- All contributors and testers

---

## 📞 Support

For support, email support@memorymaster.app or open an issue on GitHub.

---

<div align="center">

Made with ❤️ by developers who love learning

⭐ Star this repo if you find it helpful!

</div>
