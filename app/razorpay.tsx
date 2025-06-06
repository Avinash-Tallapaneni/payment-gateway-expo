import { useState } from "react";
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
  id: string;
  name: string;
  price: number;
};

const products: Product[] = [
  { id: "1", name: "Headphones", price: 100 },
  { id: "2", name: "Fitness Watch", price: 1200 },
  { id: "3", name: "Speaker", price: 400 },
];

type Cart = { [key: string]: number };

export default function RazorpayScreen() {
  const [cart, setCart] = useState<Cart>({});

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      const updated = prev[id] - 1;
      if (updated <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: updated };
    });
  };

  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + (product?.price ?? 0) * qty;
  }, 0);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const handlePayment = () => {
    if (totalAmount === 0) {
      Alert.alert("Cart Empty", "Add some products first.");
      return;
    }

    let options = {
      description: "`${totalItems} item(s)`",
      currency: "INR",
      key: process.env.EXPO_PUBLIC_RAZORPAY_KEY || "",
      amount: totalAmount,
      name: "SimpleCart",
      order_id: "",
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const qty = cart[item.id] || 0;
          return (
            <View style={styles.itemRow}>
              <Text style={styles.title}>{item.name}</Text>

              <View style={styles.controls}>
                <TouchableOpacity
                  style={[styles.button, qty === 0 && styles.disabled]}
                  onPress={() => removeFromCart(item.id)}
                  disabled={qty === 0}
                >
                  <Text style={styles.buttonText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>{qty}</Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => addToCart(item.id)}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {totalItems > 0 && (
        <View style={styles.cartBar}>
          <Text style={styles.cartText}>
            {totalItems} item(s) - ₹{(totalAmount / 100).toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.payNow} onPress={handlePayment}>
            <Text style={styles.payText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  qty: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  cartBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  payNow: {
    backgroundColor: "#6366f1",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  payText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
