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
    versionCode: 1, // 🚨 required for Google Play submission
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
    // Include other Expo plugins here if needed
  ],

  experiments: {
    typedRoutes: true,
  },

  extra: {
    eas: {
      projectId: "68cf106b-5676-49e8-8c05-13121f5b1d0a",
    },
  },
};

module.exports = withPhonePe(config);
