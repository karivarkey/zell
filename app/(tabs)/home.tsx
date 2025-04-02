import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import Header from "@/components/home/Header";
import ProductCard from "@/components/home/ProductCard";
import SearchBar from "@/components/home/SearchBar";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/types/types";
import { router } from "expo-router";

const Home = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { products, fetchProducts } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      await getLocation();
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const getLocation = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocation("Permission Denied");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const reverseGeocode = await Location.reverseGeocodeAsync(loc.coords);
    setLocation(reverseGeocode[0]?.formattedAddress || "Location not found");
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredProducts(products);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brandName.toLowerCase().includes(lowerQuery) ||
        product.vendorId.toLowerCase().includes(lowerQuery) ||
        product.features.category.toLowerCase().includes(lowerQuery) ||
        product.features.features.some((feature) =>
          feature.toLowerCase().includes(lowerQuery)
        )
    );

    setFilteredProducts(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111] px-5 pb-32">
      <Header location={location || "Fetching Location..."} />
      <View className="py-3">
        <Text className="text-white" style={{ fontFamily: "SoraBold" }}>
          Looking for apartments? Check it{" "}
          <TouchableOpacity
            onPress={() => {
              router.push("/appartments");
            }}
            className="flex items-end justify-center"
          >
            <Text
              className="text-[#D7FC70] text-center"
              style={{ fontFamily: "SoraBold" }}
            >
              out here
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
      <View className="py-4">
        <SearchBar onSearch={handleSearch} />
      </View>
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
    </SafeAreaView>
  );
};

export default Home;
