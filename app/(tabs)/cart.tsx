import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API } from "@/constants/constants";
import { auth } from "@/firebase/firebase";
import { Order, Product } from "@/types/types"; // Import Order and Product types

const Cart = () => {
  const { cartItems, removeFromCart } = useCartStore();

  // Local state to store the delivery address and status
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isAddressPrompt, setIsAddressPrompt] = useState(false);

  const placeOrder = () => {
    if (deliveryAddress.trim() === "") {
      Alert.alert("Error", "Please provide a delivery address.");
      return;
    }

    // Get userID from Firebase Auth
    const userID = auth.currentUser?.uid; // Use the user ID from the current Firebase user

    if (!userID) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    // Prepare the order object with the correct structure
    const order: Order = {
      userId: userID, // Set the userID
      shippingAddress: deliveryAddress,
      price: total,
      status: "shipped", // Set status to "shipped" (or change as needed)
      products: cartItems, // Directly use the items from the cart
    };

    console.log(order); // Check the order format in console
    console.log(`${API}/order/orders`);
    // Send the order to the server
    axios
      .post(`${API}/order/orders`, order)
      .then((response) => {
        console.log("Order placed successfully:", response.data);
        Alert.alert("Success", "Your order has been placed.");
        // Optionally, clear the cart or redirect to another screen
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        Alert.alert(
          "Error",
          "There was an issue placing your order. Please try again."
        );
      });
  };

  // Calculate total price
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-black p-4 pb-32">
      {/* Header */}
      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-4">
        Your Cart
      </Text>

      {/* Empty Cart Message */}
      {cartItems.length === 0 ? (
        <Text className="text-gray-400 text-center mt-10">
          Your cart is empty.
        </Text>
      ) : (
        <ScrollView className="mb-4">
          {cartItems.map((item) => (
            <View
              key={item.id}
              className="bg-gray-900 p-4 rounded-lg mb-3 flex-row items-center"
            >
              {/* Product Image */}
              <Image
                source={{
                  uri: `https://res.cloudinary.com/dgwb2hiol/image/upload/v1742568907/products/${item.id}.png`,
                }}
                className="rounded-lg"
                style={{ width: 80, height: 80 }}
                contentFit="cover"
              />

              {/* Product Details */}
              <View className="flex-1 ml-4">
                <Text className="text-white text-lg font-semibold">
                  {item.name}
                </Text>
                <Text className="text-gray-400">Quantity: {item.quantity}</Text>
                <Text className="text-[#D7FC70] text-lg font-bold">
                  ₹{item.price * item.quantity}
                </Text>
              </View>

              {/* Remove Button */}
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Total Price */}
      {cartItems.length > 0 && (
        <View className="mt-4">
          <View className="flex-row justify-between items-center bg-gray-800 p-4 rounded-lg">
            <Text className="text-white text-lg font-semibold">Total</Text>
            <Text className="text-[#D7FC70] text-xl font-bold">₹{total}</Text>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            className="bg-[#D7FC70] py-3 rounded-xl mt-5"
            onPress={() => setIsAddressPrompt(true)}
          >
            <Text className="text-black text-center font-semibold text-lg">
              Proceed to Confirming
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Address Prompt */}
      {isAddressPrompt && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 justify-center items-center p-4">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-semibold mb-4">
              Enter Delivery Address
            </Text>
            <TextInput
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Enter your delivery address"
              className="border p-2 rounded-md mb-4"
            />
            <TouchableOpacity
              className="bg-[#D7FC70] py-2 rounded-md"
              onPress={placeOrder}
            >
              <Text className="text-black text-center font-semibold text-lg">
                Confirm Order
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-2"
              onPress={() => setIsAddressPrompt(false)}
            >
              <Text className="text-gray-500 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;
