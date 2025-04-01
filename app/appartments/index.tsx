import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useApartmentStore } from "@/store/useAppartmentStore";
import { Linking } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const Appartments = () => {
  const { apartments, fetchApartments } = useApartmentStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  // Function to handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApartments(); // Fetch fresh data
    setRefreshing(false);
  };

  if (apartments.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-4">
        <ActivityIndicator size="large" color="#D7FC70" />
        <Text className="text-[#D7FC70] mt-4">Loading apartments...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-6">
        Apartments for Sale
      </Text>
      <FlatList
        data={apartments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-[#2C2C2C] p-4 mb-4 rounded-lg">
            {/* Apartment Image */}
            <Image
              source={{
                uri: `https://res.cloudinary.com/dgwb2hiol/image/upload/v1742568907/apartments/${item.id}.jpg`,
              }}
              className="w-full rounded-xl"
              style={{ height: 300, width: "100%" }}
            />

            <Text className="text-[#D7FC70] text-xl font-semibold mt-3">
              {item.name}
            </Text>
            <Text className="text-[#E0E0E0] mt-2">
              {item.location.address} | Rating: {item.rating}
            </Text>
            <Text className="text-[#D7FC70] text-lg mt-2">
              Price: ₹{item.price}
            </Text>

            {/* Phone Call Button */}
            <TouchableOpacity
              className="mt-3 flex-row items-center"
              onPress={() => Linking.openURL(`tel:${item.contact}`)}
            >
              <Feather name="phone-call" size={24} color="#D7FC70" />
              <Text className="text-[#D7FC70] ml-2">Call Now</Text>
            </TouchableOpacity>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#D7FC70"]}
          />
        }
      />
    </View>
  );
};

export default Appartments;
