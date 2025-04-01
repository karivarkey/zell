import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useOrderStore } from "@/store/useOrderStore"; // Zustand store for orders
import { Order } from "@/types/types";
import VendorNav from "@/components/vendor/VendorNav"; // Bottom Navigation
import OrderCard from "@/components/vendor/order/orderCard";
const Orders = () => {
  const { orders, fetchOrders } = useOrderStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      await fetchOrders();
      setLoading(false);
    };

    getOrders();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#D7FC70" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-6">
        Your Orders
      </Text>

      {orders.length === 0 ? (
        <Text className="text-gray-400 text-center">No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderCard order={item} />}
        />
      )}

      <VendorNav />
    </View>
  );
};

export default Orders;
