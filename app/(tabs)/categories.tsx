import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useProductStore } from "@/store/useProductStore";
import { router } from "expo-router";

const Categories = () => {
  const { products, fetchProducts } = useProductStore();
  const [categories, setCategories] = useState<
    { name: string; images: string[] }[]
  >([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Extract unique categories and their images
    const categoryMap = new Map<string, string[]>();

    products.forEach((product) => {
      const category = product.features.category;
      const imageUrl = `https://res.cloudinary.com/dgwb2hiol/image/upload/v1742568907/products/${product.id}.png`;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      if (categoryMap.get(category)!.length < 4) {
        categoryMap.get(category)!.push(imageUrl);
      }
    });

    setCategories(
      Array.from(categoryMap.entries()).map(([name, images]) => ({
        name,
        images,
      }))
    );
  }, [products]);

  return (
    <View className="flex-1 bg-[#111] p-4">
      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-6">
        Categories
      </Text>

      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.name}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/category/${item.name}`)}
            className="bg-[#2C2C2C] p-3 mb-4 rounded-lg w-[48%]"
          >
            {/* Category Name */}
            <Text className="text-[#D7FC70] text-lg font-semibold mb-2 text-center">
              {item.name}
            </Text>

            {/* Collage of Images */}
            <View className="flex-row flex-wrap gap-1">
              {item.images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  className="rounded-md"
                  style={{
                    width: item.images.length === 1 ? "100%" : "48%",
                    height: 75,
                  }}
                />
              ))}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Categories;
