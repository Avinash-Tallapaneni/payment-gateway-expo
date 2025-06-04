import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Payment Method</Text>

      <TouchableOpacity
        onPress={() => router.push("/phonepe")}
        style={[styles.button, { backgroundColor: "#3C99DC" }]} // PhonePe blue
      >
        <Text style={styles.buttonText}>PhonePe Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/razorpay")}
        style={[styles.button, { backgroundColor: "#F05A22" }]} // Razorpay orange
      >
        <Text style={styles.buttonText}>Razorpay Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 40,
    color: "#222",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
