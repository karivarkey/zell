import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Product } from "@/types/types";
import { useCartStore } from "@/store/useCartStore";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const querySnapshot = await getDocs(ordersRef);

        let count = 0;

        querySnapshot.forEach((doc) => {
          const orderData = doc.data();

          if (orderData.products && Array.isArray(orderData.products)) {
            // Check if any product inside this order matches our product's vendorId
            const hasMatchingProduct = orderData.products.some(
              (p) => p.vendorId === product.vendorId && p.id === product.id
            );

            if (hasMatchingProduct) {
              count++;
            }
          }
        });

        setOrderCount(count);
      } catch (error) {
        console.error("Error fetching order count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderCount(); // Directly call the function inside useEffect
  }, [product.id]); // Dependency added for better reactivity

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

      {/* Price and Category */}
      <Text className="text-[#D7FC70] text-2xl font-bold">
        ₹{product.price}
      </Text>

      {/* Category */}
      <Text className="text-[#808080] text-sm mt-1">
        {product.features?.category}
      </Text>

      {/* Number of Orders */}
      {loading ? (
        <ActivityIndicator size="small" color="#D7FC70" className="mt-2" />
      ) : (
        <Text className="text-[#808080] text-sm mt-2">
          Orders: {orderCount !== null ? orderCount : 0}
        </Text>
      )}

      {/* Add to Cart Button */}
    </TouchableOpacity>
  );
};

export default ProductCard;
