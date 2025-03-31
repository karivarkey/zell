import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Profile from "@/assets/images/home/profile.svg";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
type Props = {
  location: string;
};

const Header = ({ location }: Props) => {
  const router = useRouter();
  return (
    <View className="flex flex-row items-center justify-between w-full pt-5 ">
      <View className="flex flex-col gap-2">
        <Text
          className="text-[#FFFFFF] opacity-60"
          style={{ fontFamily: "SoraSemiBold" }}
        >
          Currently Exploring
        </Text>
        <View>
          <Text
            className="text-[#D7FC70] text-xl  text-clip overflow-clip"
            style={{ fontFamily: "SoraSemiBold" }}
            numberOfLines={1}
          >
            {location?.split(",").slice(1).join(", ").trim().substring(0, 30)}
            ...
          </Text>
          <Text
            className="text-[#FFFFFF] text-sm opacity-60"
            style={{ fontFamily: "PoppinsLight" }}
          >
            Click to change
          </Text>
        </View>
      </View>

      {/* Wrap Profile in a fixed-size container */}
      <TouchableOpacity
        className="w-12 h-12"
        onPress={() => {
          router.push("/profile");
        }}
      >
        <Profile width="100%" height="100%" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
