import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Profile from "@/assets/images/home/profile.svg";

type Props = {
  location: string;
};

const Header = ({ location }: Props) => {
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
            className="text-[#D7FC70] text-xl w-3/5 text-clip overflow-clip"
            style={{ fontFamily: "SoraSemiBold" }}
            numberOfLines={1}
          >
            {location?.split(",").slice(1).join(", ").trim().substring(0, 45)}
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
      <View className="w-12 h-12">
        <Profile width="100%" height="100%" />
      </View>
    </View>
  );
};

export default Header;
