import { StyleSheet, Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { Toast } from "toastify-react-native"; // Import Toast

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Toast.error("Passwords do not match!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Toast.success("Account created successfully!");
      router.push("/home"); // Redirect to home screen
    } catch (error: any) {
      Toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    Toast.info("Google Sign-In clicked!"); // Show Toast info message
  };

  const handleAppleSignIn = async () => {
    Toast.info("Apple Sign-In clicked!"); // Show Toast info message
  };

  return (
    <SafeAreaView className="bg-[#111111] h-screen flex flex-col justify-between">
      <StatusBar style="light" />
      <TouchableOpacity
        className="w-fit h-10 flex items-start justify-center mt-4 pl-4"
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

      <View className="bg-black rounded-t-[50px] flex flex-col justify-around h-3/4 p-6">
        <View>
          <Text className="font-bold text-4xl text-white text-center">
            Get Started !
          </Text>
          <Text className="text-[#808080] text-center">
            Enter your details below
          </Text>
        </View>

        {/* Email Input */}
        <View className="bg-[#1E1E1E] border border-[#232323] rounded-3xl flex flex-row items-center px-4 h-20">
          <Ionicons name="mail-outline" size={22} color="#808080" />
          <TextInput
            placeholder="Email ID"
            placeholderTextColor="#636363"
            className="text-white flex-1 text-lg ml-2"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View className="w-full flex flex-col gap-2">
          <View className="bg-[#1E1E1E] border border-[#232323] rounded-3xl flex flex-row items-center px-4 h-20">
            <Ionicons name="lock-closed-outline" size={22} color="#808080" />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#636363"
              className="text-white flex-1 text-lg ml-2"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Confirm Password Input */}
        <View className="bg-[#1E1E1E] border border-[#232323] rounded-3xl flex flex-row items-center px-4 h-20">
          <Ionicons name="lock-closed-outline" size={22} color="#808080" />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#636363"
            className="text-white flex-1 text-lg ml-2"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleSignUp}
          className="bg-[#D7FC70] rounded-xl py-6 flex items-center"
        >
          <Text className="text-black text-2xl font-semibold">Sign Up</Text>
        </TouchableOpacity>

        <View className="flex flex-row w-full justify-evenly">
          {/* Sign Up with Google */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            className="bg-white rounded-xl py-8 flex items-center flex-row justify-center gap-2 w-1/3"
          >
            <Ionicons name="logo-google" size={24} color="black" />
          </TouchableOpacity>

          {/* Sign Up with Apple */}
          <TouchableOpacity
            onPress={handleAppleSignIn}
            className="bg-[#000] border border-white rounded-xl py-8 flex items-center flex-row w-1/3 justify-center gap-2"
          >
            <Ionicons name="logo-apple" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <Text className="text-white text-center">
          Don't have an account?{" "}
          <Text className="text-[#D7FC70]" onPress={handleSignUp}>
            Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;
