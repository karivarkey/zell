import { View, TouchableOpacity, Text } from "react-native";
import React, { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";

const tabs: {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}[] = [
  { name: "Home", icon: "home-outline", route: "/vendor/home" },
  { name: "Apartments", icon: "business-outline", route: "/vendor/apartment" },
  { name: "Orders", icon: "list-outline", route: "/vendor/orders" },
  { name: "Add", icon: "add-circle-outline", route: "/vendor/add" },
];

const VendorNav = () => {
  const router = useRouter();
  const segments = useSegments() as string[]; // Get current route

  // Shared animation value
  const scale = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 }); // Entry animation
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-5 left-5 right-5 bg-[#2C2C2C] p-3 rounded-2xl flex-row justify-between shadow-lg"
    >
      {tabs.map((tab) => {
        const isActive = segments.includes(tab.route.split("/").pop()!); // Check if active

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.route as any)}
            className="flex-1 items-center py-2"
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={isActive ? "#D7FC70" : "#A0A0A0"}
            />
            <Text
              className={`text-sm font-semibold ${
                isActive ? "text-[#D7FC70]" : "text-gray-400"
              }`}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

export default VendorNav;
