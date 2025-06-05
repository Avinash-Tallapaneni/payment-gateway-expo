# 📲 PhonePe & Razorpay Payment Gateway Integration for React Native (Expo Managed Workflow)

Easily integrate the **PhonePe** and **Razorpay** Payment Gateways into your React Native project using Expo’s managed workflow, with automated native configuration via a custom Expo config plugin.

---

## 📚 Table of Contents

- [Installation](#installation)
- [Android Native Configuration](#android-native-configuration)
- [Expo Plugin Setup](#expo-plugin-setup)
- [Create app.config.js](#create-appconfigjs)
- [Usage Notes](#usage-notes)
- [Build & Sync](#build--sync)
- [Razorpay Integration](#razorpay-integration)
- [Additional Resources](#additional-resources)
- [Follow Me](#follow-me)

---

## 🔧 Installation

Install the PhonePe and Razorpay React Native SDKs:

```bash
npm install react-native-phonepe-pg -f
npx expo install react-native-razorpay
npm install -f
```

---

## 🤖 Android Native Configuration

To enable PhonePe payments on Android, you must add the PhonePe Maven repository to your project-level `build.gradle`.

> **Note**: This step is **automated** by the Expo plugin described below. Manual edits are only needed if not using the plugin.

```gradle
// android/build.gradle

allprojects {
    repositories {
        google()
        maven {
            url "https://phonepe.mycloudrepo.io/public/repositories/phonepe-intentsdk-android"
        }
        // ...other repositories
    }
}
```

---

## 🧩 Expo Plugin Setup

Automate the native configuration by creating a custom Expo config plugin.

### 1. Create the Plugin

Create a file at `plugins/phonepePlugin.js` in your project root:

```js
const { withProjectBuildGradle } = require("expo/config-plugins");

const PHONEPE_MAVEN_REPO = `maven {
      url "https://phonepe.mycloudrepo.io/public/repositories/phonepe-intentsdk-android"
    }`;

const withPhonePe = (config) => {
  return withProjectBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;

    if (!buildGradle.includes(PHONEPE_MAVEN_REPO.trim())) {
      buildGradle = buildGradle.replace(
        /(allprojects\s*{[\s\S]*?repositories\s*{)/,
        `$1\n    ${PHONEPE_MAVEN_REPO}`
      );
      config.modResults.contents = buildGradle;
      console.log("PhonePe Maven repository added.");
    } else {
      console.log("PhonePe Maven repository already exists.");
    }
    return config;
  });
};

module.exports = withPhonePe;
```

---

## 📁 Create `app.config.js`

Expo managed workflow users:  
You must create an `app.config.js` file in your project root.  
`app.config.js` will overwrite `app.json` during Expo prebuild, so make all configuration changes here.

### Example `app.config.js`:

```js
const withPhonePe = require("./plugins/phonepePlugin");

const config = {
  name: "paymentIntegration",
  slug: "paymentIntegration",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "paymentintegration",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.anonymous.paymentIntegration",
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.anonymous.paymentIntegration",
    versionCode: 1,
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    // Add other Expo plugins as needed
  ],

  experiments: {
    typedRoutes: true,
  },
};

module.exports = withPhonePe(config);
```

---

## 📝 Usage Notes

- `app.config.js` will overwrite `app.json` during Expo prebuild.
- Make all configuration changes in `app.config.js` going forward.
- The plugin automatically inserts the PhonePe Maven repository into your `android/build.gradle` during `expo prebuild`.
- If you add other native modules, ensure their plugins are also included in the `plugins` array.

---

## 🛠️ Build & Sync

After configuration:

```bash
npx expo prebuild
# or
npx expo run:android
```

Then, navigate to the Android directory and sync/build gradle:

```bash
cd android
./gradlew build
```

---

## 💳 Razorpay Integration

### 1. Install Razorpay React Native SDK

```bash
npm install react-native-razorpay --save
# or with yarn
yarn add react-native-razorpay
# or with Expo
npx expo install react-native-razorpay
```

### 2. Run Prebuild

```bash
npx expo prebuild
npx expo run:android
```

### 3. Example Payment Handler

```js
import RazorpayCheckout from "react-native-razorpay";
import { Alert } from "react-native";

const handlePayment = () => {
  if (totalAmount === 0) {
    Alert.alert("Cart Empty", "Add some products first.");
    return;
  }

  let options = {
    description: `${totalItems} item(s)`,
    currency: "INR",
    key: "<YOUR_RAZORPAY_KEY_ID>",
    amount: totalAmount, // in paise (e.g., ₹100 = 10000)
    name: "SimpleCart",
    order_id: "", // Keep empty or you'll get "uh ohh something went wrong"
    prefill: {
      email: "test@example.com",
      contact: "911234567890",
      name: "Customer",
    },
    theme: { color: "#6366f1" },
  };

  RazorpayCheckout.open(options)
    .then((data) => {
      console.log("Payment success:", data);
      Alert.alert("Payment Success", `ID: ${data.razorpay_payment_id}`);
      setCart({});
    })
    .catch((error) => {
      console.log("Payment Error:", error);
      Alert.alert("Payment Failed", `${error.code} | ${error.description}`);
    });
};
```

> ⚠️ **Important**: Keep `order_id` as an empty string unless you are generating it server-side. Providing a wrong/expired ID will cause the payment to fail.

---

## 🔗 Additional Resources

- [PhonePe Android SDK Docs](https://developer.phonepe.com/v1/reference/react-native-sdk-integration-standard-2)
- [Razorpay React Native Docs](https://razorpay.com/docs/payments/payment-gateway/android-integration/react-native/)
- [Expo Config Plugins](https://docs.expo.dev/guides/config-plugins/)

---

## 🙋‍♂️ Follow Me

Follow me on [Twitter](https://x.com/tallapaneniavi)
