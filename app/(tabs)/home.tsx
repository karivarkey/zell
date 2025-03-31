import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import * as Location from "expo-location";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Toast } from "toastify-react-native";
import Header from "@/components/home/Header";
import ProductCard from "@/components/home/ProductCard";
import SearchBar from "@/components/home/SearchBar";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types/types";
const Home = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { products, fetchProducts } = useProductStore();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Fetch products and location on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      await getLocation();
      setLoading(false);
    };
    loadData();
  }, []);

  // Sync filteredProducts only once after fetchProducts completes
  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products);
    }
  }, [products]); // Ensures it runs only when `products` updates

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocation("Permission Denied");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    let reverseGeocode = await Location.reverseGeocodeAsync(loc.coords);
    if (reverseGeocode.length > 0) {
      setLocation(reverseGeocode[0].formattedAddress || "Error");
    } else {
      setLocation("Location not found");
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Toast.success("Signed Out Successfully!", "bottom");
    } catch (error: any) {
      Toast.error(`Sign Out Failed: ${error.message}`, "bottom");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111] px-5 pb-32">
      <Header location={location || "Fetching Location..."} />
      <View className="py-3">
        <Text className="text-white" style={{ fontFamily: "SoraBold" }}>
          Looking for apartments? Check it{" "}
          <Text className="text-[#D7FC70]">out here</Text>
        </Text>
      </View>
      <View className="py-4">
        <SearchBar onSearch={handleSearch} />
      </View>
      {/* Product Grid with Pull to Refresh */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "space-around",
          marginBottom: 10,
        }}
        renderItem={({ item }) => <ProductCard product={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#D7FC70"
          />
        }
      />
      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-[#D7FC70] flex-row items-center justify-center gap-2 py-4 px-6 rounded-xl mt-4"
      >
        <Ionicons name="log-out-outline" size={24} color="black" />
        <Text className="text-black text-xl font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
