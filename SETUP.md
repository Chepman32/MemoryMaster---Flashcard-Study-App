# MemoryMaster Setup Guide

This guide will help you set up and run the MemoryMaster app on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

4. **Watchman** (macOS/Linux)
   ```bash
   # macOS
   brew install watchman

   # Linux
   # Follow instructions at https://facebook.github.io/watchman/docs/install.html
   ```

### For iOS Development

5. **Xcode** (macOS only)
   - Download from Mac App Store
   - Install Command Line Tools:
     ```bash
     xcode-select --install
     ```

6. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

### For Android Development

7. **Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK (API level 31+)
   - Set up Android emulator

8. **Java Development Kit (JDK)**
   - JDK 11 or higher
   - Verify: `java -version`

9. **Environment Variables**
   Add to your `~/.zshrc` or `~/.bash_profile`:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/MemoryMaster---Flashcard-Study-App.git
cd MemoryMaster---Flashcard-Study-App
```

### 2. Install Dependencies

```bash
npm install
```

This will install all necessary packages including:
- React Native
- React Navigation
- Reanimated
- Skia
- SQLite
- And all other dependencies

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

This installs iOS-specific dependencies through CocoaPods.

### 4. Running the App

#### Start Metro Bundler

In one terminal window:
```bash
npm start
```

#### Run on iOS (macOS only)

In another terminal window:
```bash
npm run ios
```

Or for a specific simulator:
```bash
npm run ios -- --simulator="iPhone 15 Pro"
```

#### Run on Android

Make sure you have:
- Android emulator running, OR
- Physical Android device connected via USB with USB debugging enabled

Then run:
```bash
npm run android
```

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Cache Issues

```bash
npm start -- --reset-cache
```

#### 2. iOS Build Failures

```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

#### 3. Android Build Failures

```bash
cd android
./gradlew clean
cd ..
npm run android
```

#### 4. Module Not Found Errors

```bash
rm -rf node_modules
npm install
```

#### 5. Xcode Build Errors

- Open `ios/MemoryMaster.xcworkspace` in Xcode
- Clean build folder: `Product` → `Clean Build Folder`
- Rebuild

#### 6. Android Gradle Issues

```bash
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
```

### Platform-Specific Issues

#### iOS

**Error: "Unable to boot device"**
- Restart Xcode
- Reset simulator: `Hardware` → `Erase All Content and Settings`

**Error: "Command PhaseScriptExecution failed"**
- Update CocoaPods: `sudo gem install cocoapods`
- Reinstall pods: `cd ios && pod install`

#### Android

**Error: "SDK location not found"**
- Create `android/local.properties`:
  ```
  sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
  ```

**Error: "Execution failed for task ':app:installDebug'"**
- Check device connection: `adb devices`
- Restart adb: `adb kill-server && adb start-server`

## Development Tools

### Debugging

#### React Native Debugger

1. Install: `brew install --cask react-native-debugger`
2. Open before running app
3. Shake device/simulator and select "Debug"

#### Flipper

1. Install from [fbflipper.com](https://fbflipper.com/)
2. Open Flipper before running app
3. Connect to your device automatically

### Code Quality

#### Linting

```bash
npm run lint
```

Fix automatically:
```bash
npm run lint -- --fix
```

#### Type Checking

```bash
npm run typecheck
```

#### Formatting

```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

## Testing

### Run Tests

```bash
npm test
```

### Watch Mode

```bash
npm test -- --watch
```

### Coverage

```bash
npm test -- --coverage
```

## Building for Production

### iOS

1. Open `ios/MemoryMaster.xcworkspace` in Xcode
2. Select "Any iOS Device" as target
3. Product → Archive
4. Follow App Store submission process

### Android

#### Debug APK
```bash
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Release APK
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

## Environment Setup

### Development

Create `.env` file:
```
ENV=development
API_URL=http://localhost:3000
```

### Production

Create `.env.production` file:
```
ENV=production
API_URL=https://api.memorymaster.app
```

## Useful Commands

```bash
# Start Metro bundler
npm start

# Clear cache
npm start -- --reset-cache

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type check
npm run typecheck

# Lint code
npm run lint

# Run tests
npm test

# Clean and rebuild
npm run clean
```

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Skia](https://shopify.github.io/react-native-skia/)

## Getting Help

- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- Review [GitHub Issues](https://github.com/yourusername/MemoryMaster/issues)
- Read [Contributing Guide](CONTRIBUTING.md)

## Next Steps

1. ✅ Complete setup
2. 📱 Run the app
3. 📚 Read the [README.md](README.md)
4. 💡 Explore the codebase
5. 🚀 Start developing!

Happy coding! 🎉
