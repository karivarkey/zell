import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";
import { useApartmentStore } from "@/store/useAppartmentStore";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

const Apartments = () => {
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

  // Function to open Google Maps with coordinates
  const openInMaps = (lat: number, long: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
    Linking.openURL(url);
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
              source={{ uri: item.imageUrl }}
              className="w-full rounded-xl"
              style={{ height: 300, width: "100%" }}
            />

            <Text className="text-[#D7FC70] text-xl font-semibold mt-3">
              {item.name}
            </Text>
            <Text className="text-[#E0E0E0] mt-2">
              📍 {item.location?.address || "No address available"}
            </Text>
            <Text className="text-[#D7FC70] text-lg mt-2">
              Price: ₹{item.price}
            </Text>

            {/* Buttons Row */}
            <View className="flex-row justify-between mt-3">
              {/* Phone Call Button */}
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => Linking.openURL(`tel:${item.contact}`)}
              >
                <Feather name="phone-call" size={24} color="#D7FC70" />
                <Text className="text-[#D7FC70] ml-2">Call Now</Text>
              </TouchableOpacity>

              {/* Route Button */}
              {item.location?.lat && item.location?.long && (
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() =>
                    openInMaps(item.location.lat, item.location.long)
                  }
                >
                  <Ionicons name="location-outline" size={24} color="#D7FC70" />
                  <Text className="text-[#D7FC70] ml-2">Route</Text>
                </TouchableOpacity>
              )}
            </View>
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

export default Apartments;
