import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Product } from "@/types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="bg-black p-4 rounded-2xl shadow-lg"
      onPress={() => {
        router.push({
          pathname: "/product",
          params: { data: JSON.stringify(product) }, // Encode product as a string
        });
      }}
    >
      {/* Product Image */}
      <View className="relative">
        <Image
          source={{
            uri: `https://res.cloudinary.com/dgwb2hiol/image/upload/v1742568907/products/${product.id}.png`,
          }}
          className="w-full h-48 rounded-xl"
          contentFit="cover"
          style={{ height: 150, width: 150 }}
        />
        <TouchableOpacity className="absolute top-1 right-1">
          <Ionicons name="heart-outline" size={24} color="#D7FC70" />
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <Text className="text-white text-lg font-semibold mt-3">
        {product.name}
      </Text>

      <Text className="text-[#D7FC70] text-2xl font-bold">
        ₹{product.price}
      </Text>
      <Text className="text-gray-400 text-sm mt-1">{product.vendorId}</Text>
    </TouchableOpacity>
  );
};
export default ProductCard;
