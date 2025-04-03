import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Switch,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useOrderStore } from "@/store/useOrderStore"; // Zustand store for orders
import VendorNav from "@/components/vendor/VendorNav"; // Bottom Navigation
import OrderCard from "@/components/vendor/order/orderCard";

const Orders = () => {
  const { orders, fetchOrders, updateOrderStatus } = useOrderStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hideDelivered, setHideDelivered] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      await fetchOrders();
      setLoading(false);
    };

    getOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: "delivered" | "shipped" | "cancelled"
  ) => {
    setUpdatingOrderId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setUpdatingOrderId(null);
    fetchOrders(); // Refresh orders after status update
  };

  const filteredOrders = hideDelivered
    ? orders.filter((order) => order.status !== "delivered")
    : orders;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#D7FC70" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-4">
        Your Orders
      </Text>

      {/* Toggle to hide delivered orders */}
      <View className="flex-row items-center justify-center mb-4">
        <Text className="text-gray-400 mr-2">Hide Delivered</Text>
        <Switch
          value={hideDelivered}
          onValueChange={setHideDelivered}
          trackColor={{ false: "#444", true: "#D7FC70" }}
          thumbColor={hideDelivered ? "#D7FC70" : "#888"}
        />
      </View>

      <View className="pb-44">
        {filteredOrders.length === 0 ? (
          <Text className="text-gray-400 text-center">No orders found.</Text>
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={({ item }) => (
              <OrderCard
                order={item}
                updating={updatingOrderId === item.id}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#D7FC70"]}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <VendorNav />
    </View>
  );
};

export default Orders;
