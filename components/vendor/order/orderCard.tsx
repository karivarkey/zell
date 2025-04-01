import { View, Text, TouchableOpacity, Animated } from "react-native";
import React, { useState } from "react";
import { Order } from "@/types/types";

// Type the status correctly for the state
type OrderStatus = "delivered" | "shipped" | "cancelled";

const OrderCard = ({ order }: { order: Order }) => {
  const [status, setStatus] = useState<OrderStatus>(order.status); // Ensuring status is typed correctly
  const fadeAnim = useState(new Animated.Value(0))[0]; // Start with opacity 0

  // Animation to fade in when order card appears
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    fadeIn(); // Trigger fade-in animation on mount
  }, []);

  // Properly type the newStatus parameter
  const handleStatusChange = (newStatus: OrderStatus) => {
    // Add status change logic (e.g., update Firestore)
    setStatus(newStatus);
  };

  return (
    <Animated.View
      className="bg-[#2C2C2C] p-4 rounded-xl mb-4 shadow-md"
      style={{ opacity: fadeAnim }}
    >
      <Text className="text-white text-lg font-bold">Order ID: {order.id}</Text>
      <View className="mt-2">
        {order.products.map((product) => (
          <View
            key={product.id}
            className="flex-row justify-between border-b border-gray-600 pb-2 mb-2"
          >
            <Text className="text-white">{product.name}</Text>
            <Text className="text-[#D7FC70]">₹{product.price}</Text>
          </View>
        ))}
      </View>

      <Text className="text-gray-300">Total: ₹{order.price}</Text>
      <Text className="text-gray-500">Status: {status}</Text>

      <View className="flex-row justify-between mt-4">
        {["shipped", "delivered", "cancelled"].map((statusOption) => (
          <TouchableOpacity
            key={statusOption}
            onPress={() => handleStatusChange(statusOption as OrderStatus)} // Type casting
            className={`p-2 rounded-md ${
              status === statusOption
                ? "bg-[#D7FC70]"
                : "bg-[#333333] border-2 border-[#D7FC70]"
            }`}
          >
            <Text
              className={`text-center text-white ${
                status === statusOption ? "font-bold" : ""
              }`}
            >
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

export default OrderCard;
