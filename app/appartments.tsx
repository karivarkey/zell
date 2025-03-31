import React, { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { useApartmentStore } from "@/store/useAppartmentStore";
import { ActivityIndicator } from "react-native";

type Props = {};

const Appartments = (props: Props) => {
  // Fetch apartments from store
  const { apartments, fetchApartments } = useApartmentStore();

  // Use useEffect to fetch apartments when the component mounts
  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  // Render loading state if apartments are being fetched
  if (apartments.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-4">
        <ActivityIndicator size="large" color="#D7FC70" />
        <Text className="text-[#D7FC70] mt-4">Loading apartments...</Text>
      </View>
    );
  }

  // Render list of apartments
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
            <Text className="text-[#D7FC70] text-xl font-semibold">
              {item.name}
            </Text>
            <Text className="text-[#E0E0E0] mt-2">
              {item.location.address} | Rating: {item.rating}
            </Text>
            <Text className="text-[#D7FC70] text-lg mt-2">
              Price: ₹{item.price}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default Appartments;
