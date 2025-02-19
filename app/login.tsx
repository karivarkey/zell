import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
type Props = {};

const login = (props: Props) => {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-[#111111] h-screen flex flex-col justify-between"
    
    >
      <StatusBar style="light" />
      <TouchableOpacity className="w-fit h-10 flex items-start justify-center mt-4 pl-4 "
      onPress={() => router.back()}
      >
      <Image
          source={require("../assets/images/login/back.png")}
          style={{ width: 45, height: 45, resizeMode: "contain" }}
        />
      </TouchableOpacity>
      <View className="flex-1 flex items-center justify-center">
        <Image
          source={require("../assets/images/login/logo.png")}
          style={{ width: 300, height: 200, resizeMode: "contain" }}
        />
      </View>
      <View className="bg-black rounded-t-[50px]  h-2/3">
      </View>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
