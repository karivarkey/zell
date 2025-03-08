import { View, TouchableOpacity } from "react-native";
import { useRouter, useSegments } from "expo-router";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

import Home from "@/assets/images/tabBar/home.svg";
import HomeActive from "@/assets/images/tabBar/homeActive.svg";
import Category from "@/assets/images/tabBar/category.svg";
import CategoryActive from "@/assets/images/tabBar/categoryActive.svg";
import Cart from "@/assets/images/tabBar/cart.svg";
import CartActive from "@/assets/images/tabBar/cartActive.svg";

const TABS = [
  { name: "home", inactiveIcon: Home, activeIcon: HomeActive },
  { name: "categories", inactiveIcon: Category, activeIcon: CategoryActive },
  { name: "cart", inactiveIcon: Cart, activeIcon: CartActive },
];

export default function CustomTabBar() {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[1]; // Extract the active tab from the URL

  return (
    <View className="absolute bottom-4 left-5 right-5 bg-[#D7FC70] flex-row justify-around items-center p-3 rounded-full">
      {TABS.map((tab) => {
        const isActive = currentRoute === tab.name;
        const IconComponent = isActive ? tab.activeIcon : tab.inactiveIcon;

        // Shared animation value
        const scale = useSharedValue(isActive ? 1.2 : 1);

        // Trigger animation when active
        scale.value = withSpring(isActive ? 1.2 : 1, {
          damping: 10,
          stiffness: 100,
        });

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(`/(tabs)/${tab.name}` as any)}
            className="flex items-center justify-center"
          >
            <Animated.View
              style={{
                transform: [{ scale }],
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: isActive ? "black" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconComponent width={30} height={30} />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
