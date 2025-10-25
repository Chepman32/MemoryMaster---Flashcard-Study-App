# MemoryMaster - Quick Start Guide

Get up and running with MemoryMaster in 5 minutes!

## 🚀 Fast Setup

### 1. Prerequisites Check

```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

### 2. Install & Run

```bash
# Clone the repo
git clone https://github.com/yourusername/MemoryMaster---Flashcard-Study-App.git
cd MemoryMaster---Flashcard-Study-App

# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..
npm run ios

# For Android
npm run android
```

That's it! The app should now be running on your simulator/emulator.

## 📱 First Time Using the App

### Creating Your First Deck

1. **Launch the app** - You'll see the animated splash screen
2. **Tap the + button** on the home screen
3. **Name your deck** (e.g., "Spanish Vocabulary")
4. **Choose a color** to identify your deck
5. **Tap Save**

### Adding Your First Card

1. **Open your deck** by tapping on it
2. **Tap "Add Card"**
3. **Front**: Enter the question (e.g., "Hello")
4. **Back**: Enter the answer (e.g., "Hola")
5. **Hint** (optional): Add a memory aid
6. **Tap Save**

### Starting Your First Study Session

1. **Open your deck**
2. **Tap "Study Now"**
3. **Read the front** of the card
4. **Tap to flip** and see the answer
5. **Rate yourself**:
   - **Again**: Didn't know it
   - **Hard**: Barely remembered
   - **Good**: Got it right
   - **Easy**: Knew it instantly

### Using Swipe Gestures (Optional)

Enable in Settings → Swipe Gestures

- **Swipe ← Left**: Again
- **Swipe → Right**: Easy
- **Swipe ↑ Up**: Good
- **Swipe ↓ Down**: Hard

## 🎯 Pro Tips

### 1. Optimal Study Sessions
- Study **10-20 new cards** per day
- Review cards **when they're due**
- Keep sessions **under 20 minutes**
- Study at the **same time** daily

### 2. Creating Effective Cards
- Keep questions **simple and focused**
- Use **one concept** per card
- Add **hints** for difficult cards
- Include **context** when needed

### 3. Using the Algorithm
- The app uses **SM-2 spaced repetition**
- Cards you **get right** appear less often
- Cards you **get wrong** appear more often
- Trust the algorithm - it's scientifically proven!

### 4. Tracking Progress
- Check **Statistics** tab for insights
- Monitor your **retention rate** (aim for 85-90%)
- Track your **study streak**
- Review **session history**

## 📚 Sample Decks

Want to try the app immediately? Run this in the app:

```typescript
// In React Native Debugger console or add to App.tsx temporarily
import {seedSampleData} from './src/utils/sampleData';
seedSampleData();
```

This creates two sample decks:
- **Spanish Vocabulary** (20 cards)
- **JavaScript Basics** (10 cards)

## 🎨 Customization

### Themes
Settings → Toggle Dark Mode

### Study Preferences
- **Show Timer**: Display study duration
- **Swipe Gestures**: Enable gesture controls
- **Haptic Feedback**: Vibration on actions
- **Sound Effects**: Audio feedback

## 📤 Import/Export

### Importing Cards

Create a CSV file:
```csv
Front,Back,Hint
Hello,Hola,Common greeting
Goodbye,Adiós,Farewell
```

Then: Settings → Import → Select File

### Exporting Cards

Deck → Menu (⋮) → Export → Choose Format

## 🔧 Troubleshooting

### App Won't Start?
```bash
npm start -- --reset-cache
```

### Build Errors?
```bash
# iOS
cd ios && pod install && cd ..

# Android
cd android && ./gradlew clean && cd ..
```

### No Decks Showing?
- Check if database initialized
- Try creating a new deck
- Restart the app

## 📖 Learning the App

### 5-Minute Tour
1. ✅ Create a deck (1 min)
2. ✅ Add 3-5 cards (2 min)
3. ✅ Study session (2 min)
4. ✅ Check statistics (1 min)

### Daily Workflow
1. **Morning**: Review due cards (5-10 min)
2. **Afternoon**: Add new cards (5 min)
3. **Evening**: Quick review (5 min)

## 🎓 Study Tips

### For Language Learning
- Add **pronunciation** hints
- Include **example sentences**
- Use **images** when possible
- Practice **both directions** (EN→ES and ES→EN)

### For Technical Topics
- Break down **complex concepts**
- Use **code examples**
- Link **related concepts**
- Include **practical applications**

### For Exam Prep
- Start **early** (2-3 weeks before)
- Focus on **weak areas**
- Do **active recall**
- Review **mistake cards** extra

## 📊 Understanding Statistics

### Key Metrics

**Retention Rate**
- **90%+**: Excellent
- **80-90%**: Good
- **70-80%**: Needs work
- **<70%**: Cards too difficult or too fast

**Study Streak**
- Consistency is key
- Aim for **21 days** to build habit
- **Don't break the chain!**

**Mastery Percentage**
- Shows how well you know a deck
- **<25%**: Just started
- **25-50%**: Making progress
- **50-75%**: Good knowledge
- **75%+**: Mastered

## 🚀 Next Steps

Now that you're set up:

1. ✅ **Create your first real deck**
2. ✅ **Add 10-20 cards**
3. ✅ **Complete a study session**
4. ✅ **Enable dark mode** (if you prefer)
5. ✅ **Set a daily goal**
6. ✅ **Study consistently for a week**

## 📞 Need Help?

- 📖 Read the [full README](README.md)
- 🔧 Check [SETUP.md](SETUP.md) for detailed setup
- 🐛 See [TROUBLESHOOTING](SETUP.md#troubleshooting)
- 💬 Open an [issue on GitHub](https://github.com/yourusername/MemoryMaster/issues)

## 🎉 Happy Learning!

Remember: **Consistency beats intensity**. Study a little every day rather than cramming!

---

Made with ❤️ for learners worldwide
