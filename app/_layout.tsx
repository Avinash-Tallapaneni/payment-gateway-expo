import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="phonepe" options={{ title: "PhonePe Payment" }} />
      <Stack.Screen name="razorpay" options={{ title: "Razorpay Payment" }} />
    </Stack>
  );
}
