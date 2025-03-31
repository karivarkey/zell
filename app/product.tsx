import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Product } from "@/types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/useCartStore"; // Import Zustand store

const ProductPage = () => {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCartStore();

  if (!data)
    return <Text className="text-white text-center mt-10">Loading...</Text>;

  const product: Product = JSON.parse(data as string);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <ScrollView className="flex-1 bg-black p-4">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-[#D7FC70] text-lg font-semibold mb-2">BACK</Text>
      </TouchableOpacity>

      {/* Product Image */}
      <View className="items-center">
        <Image
          source={{
            uri: `https://res.cloudinary.com/dgwb2hiol/image/upload/v1742568907/products/${product.id}.png`,
          }}
          className="w-full rounded-xl"
          style={{ height: 300, width: "100%" }}
          contentFit="contain"
        />
      </View>

      {/* Product Details */}
      <View className="mt-5">
        <Text className="text-[#D7FC70] text-xl font-bold">{product.name}</Text>
        <Text className="text-gray-400 text-sm mt-1">
          Brand: {product.brandName}
        </Text>

        {/* Price */}
        <Text className="text-[#D7FC70] text-3xl font-extrabold mt-3">
          ₹{product.price}
        </Text>

        {/* Rating & Reviews */}
        <View className="flex-row items-center mt-2">
          <Ionicons name="star" size={18} color="#FFD700" />
          <Text className="text-white ml-1 text-lg">{product.rating} / 5</Text>
          <Text className="text-gray-400 ml-2">
            ({product.reviews.length} reviews)
          </Text>
        </View>
      </View>

      {/* Features */}
      {product.features?.features?.length > 0 && (
        <View className="mt-6">
          <Text className="text-white text-lg font-semibold">Key Features</Text>
          <Text className="text-gray-400 text-sm mb-2">
            {product.features.category}
          </Text>
          {product.features.features.map((feature, index) => (
            <Text key={index} className="text-gray-300 text-sm">
              • {feature}
            </Text>
          ))}
        </View>
      )}

      {/* Vendor Info */}
      <Text className="text-gray-500 text-sm mt-4">
        Sold by: {product.vendorId}
      </Text>

      {/* Add to Cart Button */}
      <TouchableOpacity
        className="bg-[#D7FC70] py-3 rounded-xl mt-5"
        onPress={handleAddToCart}
      >
        <Text className="text-black text-center font-semibold text-lg">
          Add to Cart
        </Text>
      </TouchableOpacity>

      {/* Reviews Section */}
      {product.reviews.length > 0 && (
        <View className="mt-8">
          <Text className="text-white text-lg font-semibold">
            Customer Reviews
          </Text>
          {product.reviews.map((review, index) => (
            <View key={index} className="mt-3 p-3 bg-gray-800 rounded-lg">
              <Text className="text-[#D7FC70] font-semibold">
                {review.userId}
              </Text>
              <Text className="text-gray-300 text-sm mt-1">
                {review.review}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Spacer */}
      <View className="h-10"></View>
    </ScrollView>
  );
};

export default ProductPage;
