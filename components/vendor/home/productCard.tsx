import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Product } from "@/types/types";
import { useCartStore } from "@/store/useCartStore";
import { db } from "@/firebase/firebase"; // Assuming you've initialized Firebase correctly
import { collection, query, where, getDocs } from "firebase/firestore"; // Firebase Firestore functions

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const [orderCount, setOrderCount] = useState<number | null>(null); // To store the number of orders
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching data

  // Fetch the number of orders for this product
  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("products", "array-contains", product.id)
        );
        const querySnapshot = await getDocs(q);
        setOrderCount(querySnapshot.size); // Set the order count
      } catch (error) {
        console.error("Error fetching order count:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOrderCount();
  }, [product.id]); // Re-run the effect if product id changes

  const handleAddToCart = () => {
    console.log("Adding to cart", product);
    addToCart(product);
  };

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
      <TouchableOpacity
        className="bg-[#D7FC70] p-2 mt-3 rounded-xl flex-row items-center justify-center"
        onPress={handleAddToCart}
      >
        <Ionicons name="cart-outline" size={20} color="black" />
        <Text className="text-black font-semibold ml-2">Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProductCard;
