import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
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

    fetchOrderCount();
  }, [product.id]);

  return (
    <TouchableOpacity
      className="bg-black p-4 rounded-2xl shadow-lg mx-2"
      onPress={() => {
        router.push({
          pathname: "/product",
          params: { data: JSON.stringify(product) }, // Encode product as a string
        });
      }}
      style={{ width: 180 }} // Fixed width
    >
      {/* Product Image */}
      <View className="relative">
        <Image
          source={{
            uri: product.imageUrl,
          }}
          className="rounded-xl"
          contentFit="cover"
          style={{ height: 150, width: "100%" }}
        />
      </View>

      {/* Product Info */}
      <Text className="text-white text-lg font-semibold mt-3">
        {product.name}
      </Text>

      {/* ⭐ Rating */}
      <View className="flex-row items-center mt-1">
        <Ionicons name="star" size={16} color="#D7FC70" />
        <Text className="text-[#D7FC70] text-sm ml-1">
          {product.rating || "N/A"}
        </Text>
      </View>

      {/* Price */}
      <Text className="text-[#D7FC70] text-2xl font-bold mt-1">
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
    </TouchableOpacity>
  );
};

export default ProductCard;
