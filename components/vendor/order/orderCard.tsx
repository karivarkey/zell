import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Order } from "@/types/types";

type OrderStatus = "delivered" | "shipped" | "cancelled";

type OrderCardProps = {
  order: Order;
  updating: boolean;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
};

const OrderCard = ({ order, updating, onUpdateStatus }: OrderCardProps) => {
  const fadeAnim = useState(new Animated.Value(0))[0];

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    fadeIn();
  }, []);

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
      <Text className="text-gray-500">Status: {order.status}</Text>

      <View className="flex-row justify-between mt-4">
        {["shipped", "delivered", "cancelled"].map((statusOption) => (
          <TouchableOpacity
            key={statusOption}
            onPress={() =>
              onUpdateStatus(order.id ?? "", statusOption as OrderStatus)
            }
            className={`p-2 rounded-md flex-1 mx-1 ${
              order.status === statusOption
                ? "bg-[#D7FC70]"
                : "bg-[#333333] border-2 border-[#D7FC70]"
            } flex-row justify-center items-center`}
            disabled={updating}
          >
            {updating && order.status === statusOption ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                className={`text-center text-white ${
                  order.status === statusOption ? "font-bold" : ""
                }`}
              >
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

export default OrderCard;
