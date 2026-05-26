# TDERIDES

TDERIDES is a university-level React Native CLI mobile application inspired by ride-hailing platforms. It supports rider authentication, profile management, Google Maps destination search, route rendering, fare estimation, simulated driver tracking, simulated payment confirmation, and ride history stored in Firebase Firestore.

This project is designed for academic evaluation. It is functional for Android and iOS testing, but it does not implement real payments, real driver dispatching, production security rules, or production monitoring.

## Technologies

- React Native CLI
- JavaScript
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Redux Toolkit
- React Redux
- React Navigation
- Bottom Tabs Navigation
- Google Maps SDK
- Google Places Autocomplete
- Google Directions API
- Google Distance Matrix API
- React Native Maps
- React Native Image Picker
- React Native Geolocation Service

## Main Features

- User registration and login with Firebase Authentication.
- Rider profile creation and editing with profile photo upload to Firebase Storage.
- Profile validations for required fields, full name length, numeric phone number, valid email, language, gender, and password.
- Interactive map with current device location.
- Destination search using Google Places Autocomplete.
- Route rendering between current location and selected destination.
- Distance and duration calculation using Google Distance Matrix API.
- Directions validation using Google Directions API.
- Global state management with Redux Toolkit.
- Vehicle category selection for Economy, XL, and Premium.
- Estimated fare calculation using base fare, distance, and duration.
- Ride request storage in Firestore.
- Simulated driver marker moving toward the rider and then to the destination.
- Simulated ride statuses: Driver assigned, Driver arriving, In progress, Completed.
- Simulated payment methods: Credit card simulation, MercadoPago simulation, and Cash.
- Completed ride history stored and listed from Firestore.
- Language preference structure for Spanish and English.

## Folder Structure

```text
src/
  app/
    store.js
  assets/
  components/
    Button.js
    Input.js
    Loading.js
    MapViewComponent.js
    OptionSelector.js
    RideCard.js
    VehicleCard.js
  config/
    firebase.js
    googleMaps.js
  constants/
    colors.js
    vehicles.js
  navigation/
    AppNavigator.js
    AuthNavigator.js
    MainTabNavigator.js
  screens/
    auth/
      LoginScreen.js
      RegisterScreen.js
    profile/
      ProfileScreen.js
    ride/
      HomeScreen.js
      VehicleSelectionScreen.js
      RideTrackingScreen.js
      PaymentScreen.js
    history/
      RideHistoryScreen.js
    settings/
      SettingsScreen.js
  services/
    authService.js
    locationService.js
    paymentService.js
    rideService.js
    userService.js
  store/
    authSlice.js
    rideSlice.js
    userSlice.js
  styles/
    globalStyles.js
  utils/
    fareCalculator.js
    formatters.js
    validators.js
```

## Installation

1. Install Node.js 18 or newer.
2. Install Android Studio and configure an Android emulator or physical device.
3. Clone or open this project folder.
4. Install dependencies:

```bash
npm install
```

5. Create the environment file:

```bash
cp .env.example .env
```

6. Fill `.env` with Firebase and Google Maps credentials.

## Firebase Configuration

1. Create a Firebase project from the Firebase Console.
2. Add a Web App to get the Firebase client configuration.
3. Enable Authentication with Email/Password.
4. Create a Firestore database.
5. Enable Firebase Storage.
6. Copy the Firebase values into `.env`:

```env
FIREBASE_API_KEY=your_value
FIREBASE_AUTH_DOMAIN=your_value
FIREBASE_PROJECT_ID=your_value
FIREBASE_STORAGE_BUCKET=your_value
FIREBASE_MESSAGING_SENDER_ID=your_value
FIREBASE_APP_ID=your_value
GOOGLE_MAPS_API_KEY=your_value
```

## Firestore Collections

### users

```json
{
  "id": "string",
  "fullName": "string",
  "phoneNumber": "string",
  "gender": "string",
  "email": "string",
  "language": "Spanish | English",
  "profilePhotoUrl": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### rides

```json
{
  "id": "string",
  "userId": "string",
  "origin": {
    "latitude": "number",
    "longitude": "number",
    "address": "string"
  },
  "destination": {
    "latitude": "number",
    "longitude": "number",
    "address": "string"
  },
  "vehicleCategory": "economy | xl | premium",
  "distanceKm": "number",
  "durationMin": "number",
  "estimatedFare": "number",
  "paymentMethod": "string",
  "status": "string",
  "createdAt": "timestamp",
  "completedAt": "timestamp"
}
```

Ride history filters trips by `userId` and sorts them in the app, so it does not require a composite Firestore index for the academic setup.

## Suggested Academic Firebase Rules

Firestore:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /rides/{rideId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

Storage:

```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profilePhotos/{userId}.jpg {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Google Maps API Configuration

Enable these APIs in Google Cloud:

- Maps SDK for Android
- Maps SDK for iOS
- Places API
- Directions API
- Distance Matrix API

Add the key to `.env` as `GOOGLE_MAPS_API_KEY`.

Android reads the Google Maps key from `.env` through `android/app/build.gradle` and injects it into `AndroidManifest.xml`.

iOS uses `ios/TDERIDESNative/Info.plist` key `GoogleMapsApiKey`. Replace the placeholder value `GOOGLE_MAPS_API_KEY` with the same Google Maps key before running on iOS.

For iOS dependencies:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

## Run on Android

Start Metro:

```bash
npm start
```

In another terminal, run:

```bash
npm run android
```

Make sure an emulator is running or an Android device is connected with USB debugging enabled.

## Run on iOS

Run this only on macOS with Xcode installed:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

## Redux State

### authSlice

- `user`
- `isAuthenticated`
- `loading`

### userSlice

- `profile`
- `selectedLanguage`

### rideSlice

- `origin`
- `destination`
- `distance`
- `duration`
- `selectedVehicle`
- `estimatedFare`
- `rideStatus`
- `currentRide`

## Fare Formula

The fare is calculated before requesting the ride:

```text
baseFare + distanceKm * pricePerKm + durationMin * pricePerMinute
```

Vehicle values:

- Economy: base fare 3500, 1200 per km, 150 per minute.
- XL: base fare 5000, 1700 per km, 200 per minute.
- Premium: base fare 8000, 2500 per km, 300 per minute.

## Simulated Parts

- Driver assignment is simulated.
- Driver real-time tracking is simulated with interval-based marker movement.
- Payment processing is simulated.
- MercadoPago and credit card options do not connect to real providers.
- No separate driver application is included.

## Git Workflow

- `main` is the stable integration branch.
- Each team member should create a feature branch, for example `feature/auth-flow`, `feature/maps-flow`, or `feature/ride-history`.
- Commits should be clear and focused, for example `Add profile validation` or `Implement ride tracking simulation`.
- Pull requests should be opened before merging into `main`.
- Another team member should review the pull request before merge.
- Merge into `main` only after review and successful local testing.

## Team Members

- Member 1: Name pending.
- Member 2: Name pending.
- Member 3: Name pending.
- Member 4: Name pending.

## Academic Notes

- The application is built for a university project and demonstrates fullstack mobile concepts with Firebase and Google APIs.
- The implementation prioritizes clear architecture, modular services, reusable UI components, and state management.
- The project is not intended for production deployment without additional security, billing controls, driver-side workflows, payment provider integration, analytics, and hardened Firebase rules.
- Firebase rules should be tightened before any public release.

## Main Files to Review

- `App.js`
- `src/navigation/AppNavigator.js`
- `src/navigation/MainTabNavigator.js`
- `src/config/firebase.js`
- `src/config/googleMaps.js`
- `src/store/authSlice.js`
- `src/store/userSlice.js`
- `src/store/rideSlice.js`
- `src/screens/auth/RegisterScreen.js`
- `src/screens/ride/HomeScreen.js`
- `src/screens/ride/VehicleSelectionScreen.js`
- `src/screens/ride/RideTrackingScreen.js`
- `src/screens/ride/PaymentScreen.js`
- `src/screens/history/RideHistoryScreen.js`
- `src/services/authService.js`
- `src/services/userService.js`
- `src/services/rideService.js`
- `src/services/locationService.js`
- `src/utils/validators.js`
- `src/utils/fareCalculator.js`
