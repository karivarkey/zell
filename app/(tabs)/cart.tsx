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
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Import Firestore instance
import { getAuth } from "firebase/auth";

const Cart = () => {
  const { cartItems, removeFromCart } = useCartStore();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isAddressPrompt, setIsAddressPrompt] = useState(false);
  const [imageUris, setImageUris] = useState<{ [key: string]: string }>({});

  const placeOrder = async () => {
    if (deliveryAddress.trim() === "") {
      Alert.alert("Error", "Please provide a delivery address.");
      return;
    }

    const auth = getAuth();
    const userID = auth.currentUser?.uid;

    if (!userID) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderData = {
      userId: userID,
      shippingAddress: deliveryAddress,
      price: total,
      status: "shipped",
      products: cartItems,
      createdAt: serverTimestamp(),
      orderDate: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order written with ID: ", docRef.id);
      Alert.alert("Success", "Your order has been placed.");
      setDeliveryAddress("");
      setIsAddressPrompt(false);
    } catch (error) {
      console.error("Error adding order: ", error);
      Alert.alert("Error", "There was an issue placing your order.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-black p-4 pb-32">
      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-4">
        Your Cart
      </Text>

      {cartItems.length === 0 ? (
        <Text className="text-gray-400 text-center mt-10">
          Your cart is empty.
        </Text>
      ) : (
        <ScrollView className="mb-4">
          {cartItems.map((item) => {
            const primaryUrl = `https://res.cloudinary.com/dgwb2hiol/image/upload/v1742568907/products/${item.id}.png`;
            const fallbackUrl = `https://res.cloudinary.com/dgwb2hiol/image/upload/v1742568907/products/${item.id}.jpg`;
            const imageUrl = imageUris[item.id] || primaryUrl;

            return (
              <View
                key={item.id}
                className="bg-gray-900 p-4 rounded-lg mb-3 flex-row items-center"
              >
                {/* Product Image */}
                <Image
                  source={{ uri: imageUrl }}
                  className="rounded-lg"
                  style={{ width: 80, height: 80 }}
                  contentFit="cover"
                  onError={() => {
                    console.warn(
                      `Error loading ${imageUrl}, switching to fallback .jpg`
                    );
                    setImageUris((prev) => ({
                      ...prev,
                      [item.id]: fallbackUrl,
                    }));
                  }}
                />

                {/* Product Details */}
                <View className="flex-1 ml-4">
                  <Text className="text-white text-lg font-semibold">
                    {item.name}
                  </Text>
                  <Text className="text-gray-400">
                    Quantity: {item.quantity}
                  </Text>
                  <Text className="text-[#D7FC70] text-lg font-bold">
                    ₹{item.price * item.quantity}
                  </Text>
                </View>

                {/* Remove Button */}
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}

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
