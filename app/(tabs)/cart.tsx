import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useCartStore } from "@/store/useCartStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
const Cart = () => {
  const { cartItems, removeFromCart } = useCartStore();

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
          <TouchableOpacity className="bg-[#D7FC70] py-3 rounded-xl mt-5">
            <Text className="text-black text-center font-semibold text-lg">
              Proceed to Checkout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;
