import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Product } from "@/types/types";
import ProductCard from "@/components/vendor/home/productCard"; // Make sure this path is correct
import { useCartStore } from "@/store/useCartStore"; // If you're using cart store for adding items

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]); // Properly typed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch products for the current vendor
        const q = query(
          collection(db, "products"),
          where("vendorId", "==", user.uid)
        );
        const snapshot = await getDocs(q);

        // Map the products
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading state
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
        Your Products
      </Text>

      {/* FlatList to render all products */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} /> // Using ProductCard component for rendering each product
        )}
      />
    </View>
  );
};

export default Home;
