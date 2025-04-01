import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Product } from "@/types/types";
import ProductCard from "@/components/vendor/home/productCard";
import VendorNav from "@/components/vendor/VendorNav"; // Import VendorNav

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "products"),
          where("vendorId", "==", user.uid)
        );
        const snapshot = await getDocs(q);

        const items: Product[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Product),
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

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
      />

      {/* ✅ Add the animated bottom navigation */}
      <VendorNav />
    </View>
  );
};

export default Home;
