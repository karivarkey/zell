import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Product } from "@/types/types";
import ProductCard from "@/components/vendor/home/productCard";
import VendorNav from "@/components/vendor/VendorNav"; // Import VendorNav
import { Toast } from "toastify-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAuth, signOut } from "@firebase/auth";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Toast.success("Signed Out Successfully!", "bottom");
    } catch (error: any) {
      Toast.error(`Sign Out Failed: ${error.message}`, "bottom");
    }
  };

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
          id: doc.id, // Ensure each product has a unique key
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
      {/* Page Title */}
      <Text className="text-[#D7FC70] text-3xl font-bold text-center mb-6">
        Your Products
      </Text>

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="absolute top-6 right-6 bg-[#D7FC70] p-3 rounded-full shadow-lg"
      >
        <Ionicons name="log-out-outline" size={24} color="black" />
      </TouchableOpacity>

      {/* Product Grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2} // Display two items per row
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <View className="w-[48%] mb-4">
            <ProductCard product={item} />
          </View>
        )}
        contentContainerStyle={{
          paddingBottom: 100, // Space for bottom navigation
        }}
      />

      {/* Animated Bottom Navigation */}
      <VendorNav />
    </View>
  );
};

export default Home;
