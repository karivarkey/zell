import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Product, Review } from "@/types/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/useCartStore"; // Import Zustand store
import { useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, doc, updateDoc, arrayUnion } from "firebase/firestore";

const ProductPage = () => {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewRating, setReviewRating] = useState(0); // State for rating (1-5)

  if (!data)
    return <Text className="text-white text-center mt-10">Loading...</Text>;

  const product: Product = JSON.parse(data as string);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim() || !reviewTitle.trim() || reviewRating === 0) {
      Alert.alert("Error", "Title, review, and rating are required.");
      return;
    }

    const newReview: Review = {
      userId: "AnonymousUser", // Replace with actual user ID
      title: reviewTitle,
      review: reviewText,
      rating: reviewRating,
    };

    try {
      const productRef = doc(db, "products", product.id); // Reference to the specific product document

      // Calculate new average rating
      const currentReviews = [...product.reviews, newReview]; // Include the new review
      const totalRating = currentReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const newProductRating = totalRating / currentReviews.length;

      // Update both reviews and rating in Firestore
      await updateDoc(productRef, {
        reviews: arrayUnion(newReview), // Add the new review to the reviews array
        rating: newProductRating, // Update the product’s global rating
      });

      // Update local state
      product.reviews.push(newReview);
      product.rating = newProductRating; // Update local product rating
      setReviewText(""); // Clear review text
      setReviewTitle(""); // Clear review title
      setReviewRating(0); // Reset rating
      Alert.alert("Success", "Review submitted successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
      Alert.alert("Error", "Failed to submit review.");
    }
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

      {/* Review Input Section */}
      <View className="mt-6">
        <Text className="text-white text-lg font-semibold">Write a Review</Text>

        {/* Review Title Input */}
        <TextInput
          className="bg-gray-800 text-white p-3 rounded-lg mt-2"
          placeholder="Review Title"
          placeholderTextColor="gray"
          value={reviewTitle}
          onChangeText={setReviewTitle}
        />

        {/* Review Text Input */}
        <TextInput
          className="bg-gray-800 text-white p-3 rounded-lg mt-2"
          placeholder="Write your review here..."
          placeholderTextColor="gray"
          value={reviewText}
          onChangeText={setReviewText}
          multiline
        />

        {/* Rating Selection */}
        <View className="mt-2 flex-row items-center">
          <Text className="text-white text-sm mr-2">Rating (1-5):</Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setReviewRating(star)}
              className="mr-2"
            >
              <Ionicons
                name={star <= reviewRating ? "star" : "star-outline"}
                size={24}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="bg-[#D7FC70] py-3 rounded-xl mt-3"
          onPress={handleSubmitReview}
        >
          <Text className="text-black text-center font-semibold text-lg">
            Submit Review
          </Text>
        </TouchableOpacity>
      </View>

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
                {review.userId} - {review.title}
              </Text>
              <Text className="text-gray-300 text-sm mt-1">
                {review.review}
              </Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text className="text-gray-400 ml-1 text-sm">
                  {review.rating} / 5
                </Text>
              </View>
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
