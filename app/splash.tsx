import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
type Props = {};

const login = (props: Props) => {
  return (
    <View className="flex flex-col items-center justify-center h-screen bg-[#111111]">
      <Image
        source={require("../assets/images/splash/1.png")}
        style={{
          width: "100%",
          height: "50%",
        }}
      />
      <View className="bg-black w-full rounded-t-[60px] h-1/3 flex items-center justify-center">
        <Text className="text-white w-full text-center ">Discover Your Locality</Text>
      </View>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({});
