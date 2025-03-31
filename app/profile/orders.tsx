import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "@/firebase/firebase"; // Import Firebase Auth and Firestore
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

type Props = {};

const Orders = (props: Props) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch orders when user is logged in
        fetchOrders(currentUser.uid);
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribeAuth();
  }, []);

  const fetchOrders = (userId: string) => {
    setLoading(true);
    // Query Firestore for orders where userId matches current user
    const q = query(collection(db, "orders"), where("userId", "==", userId));

    // Real-time listener for orders
    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        alert("Error" + "Failed to load orders. Please try again.");
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#D7FC70" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <Text className="text-[#D7FC70] text-lg">
          No user logged in. Please log in.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black p-5">
      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-5">
        Your Orders
      </Text>

      {orders.length === 0 ? (
        <Text className="text-gray-400 text-center mt-10">
          No orders found.
        </Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-gray-900 p-4 rounded-lg mb-3">
              <Text className="text-white text-lg font-semibold">
                Order ID: {item.id}
              </Text>
              <Text className="text-gray-300">
                Date: {item.orderDate || "N/A"}
              </Text>
              <Text className="text-[#D7FC70] text-base">
                Total: ₹{item.price}
              </Text>
              <Text className="text-gray-300">
                Status: {item.status || "Pending"}
              </Text>
              <Text className="text-gray-300 mt-2">Products:</Text>
              {item.products.map((product: any, index: number) => (
                <Text key={index} className="text-white ml-4">
                  - {product.name} (Qty: {product.quantity}, Price: ₹
                  {product.price})
                </Text>
              ))}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Orders;
