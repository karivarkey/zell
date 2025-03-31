import React from "react";
import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "@/components/home/ProductCard";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
const CategoryProducts = () => {
  const { category } = useLocalSearchParams();
  const { products } = useProductStore();
  const router = useRouter();
  const filteredProducts = products.filter(
    (product) => product.features.category === category
  );

  return (
    <View className="flex-1 bg-[#111] p-4">
      <TouchableOpacity
        onPress={() => {
          console.log("pressed");
          router.back();
        }}
      >
        <Text className="text-[#D7FC70] text-lg">Back</Text>
      </TouchableOpacity>
      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-6">
        {category}
      </Text>

      {filteredProducts.length === 0 ? (
        <Text className="text-white text-center">No products found.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </View>
  );
};

export default CategoryProducts;
