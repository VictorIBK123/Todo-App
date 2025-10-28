# Todo App

This is a simple task management app built with React Native, Expo, and TypeScript.  
It allows users to add, view, edit, and delete to-do items. It enables to also add todo with voice integrated with a backend that uses GEMINI API (I built the backend too)
Tasks are stored locally on the device, so they remain even after closing the app.

---

## Features

- Add new tasks  
- View all existing tasks  
- Mark tasks as completed or not completed  
- Edit or delete any task  
- Local data persistence  
- Organized folder structure with reusable components and hooks  

---

## Project Structure

```
/
 assets/                    # Images and icons
 custom-hooks/              # Custom React hook
 screens/                   # App screens (e.g. Home, Details)
 tabs/                      # Navigation tabs
 todolistmain_component/    # Main to-do list components
 App.tsx                    # Entry point of the app
 index.ts                   # Startup file
 app.json                   # Expo configuration
 eas.json                   # EAS build configuration
 tsconfig.json              # TypeScript configuration
 package.json               # Project dependencies
 package-lock.json          # Lock file
```

Each part of the codebase is structured for clarity and scalability.

---

## Getting Started

### Prerequisites

You need to have the following installed on your system:
- Node.js (latest LTS version recommended)
- npm or Yarn
- Expo CLI
- TypeScript (already configured in this project)

---

### Installation

```bash
# Clone this repository
git clone https://github.com/VictorIBK123/Todo-App.git

# Move into the project directory
cd Todo-App

# Install dependencies
npm install
# or
yarn install
```

---

### Running the App

```bash
# Start the Expo development server
npm start
# or
yarn start
```


You can run the app using the Expo Go app on your Android or iOS device, or use an emulator though the date picker won't work because it requires a development build, to make the development build run eas build --profile preview --platform android for Android devices or eas build --profile preview --platform ios for ios devices, make sure you are logged in first in the terminal.

---

### Building for Production

The project includes an `eas.json` file, so you can use EAS Build for production.

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

Make sure you have your Expo account and credentials configured properly.

---

## How It Works

- The app uses **custom hook** to separate logic from UI.  
- It stores data locally using **AsyncStorage**.  
- The code is written with **TypeScript** for strong type checking and maintainability.  
- The UI is built with **React Native components** and follows a clean architecture pattern.
- Animations are made with **React Native Reanimated**

---


---

## Dependencies

The project mainly uses the following:

- React Native  
- Expo  
- TypeScript
- Reanimated (for animations)
- React Navigation  
- AsyncStorage (for data persistence)

Check the `package.json` file for a full list of dependencies.

---

## License

This project is open source and licensed under the MIT License.  
You can use, modify, or distribute it freely with proper credit.

---

## Contact

Maintained by **Victor Ibukun**  
GitHub: [VictorIBK123](https://github.com/VictorIBK123)
