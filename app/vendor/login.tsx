import { StyleSheet, Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { Toast } from "toastify-react-native";
type Props = {};

const Login = (props: Props) => {
  const handleLogin = async () => {
    try {
      console.log(email, password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Check if the user exists in the "vendors" collection
      const vendorRef = doc(collection(db, "vendors"), userId);
      const vendorDoc = await getDoc(vendorRef);

      if (vendorDoc.exists()) {
        Toast.success("Logged in successfully!", "bottom");
        router.push("/vendor/home"); // Redirect to vendor dashboard
      } else {
        Toast.error(
          "You are not registered as a vendor. Please register below.",
          "bottom"
        );
      }
    } catch (error: any) {
      console.log("Error:", error);
      Toast.error(`Login Failed: ${error.message}`, "bottom");
    }
  };

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <SafeAreaView className="bg-[#111111] h-screen flex flex-col justify-between">
      <StatusBar style="light" />
      <TouchableOpacity
        className="w-fit h-10 flex items-start justify-center mt-4 pl-4"
        onPress={() => router.back()}
      >
        <Image
          source={require("./../../assets/images/login/back.png")}
          style={{ width: 45, height: 45, resizeMode: "contain" }}
        />
      </TouchableOpacity>

      <View className="flex-1 flex items-center justify-center">
        <Image
          source={require("../../assets/images/login/logo.png")}
          style={{ width: 300, height: 200, resizeMode: "contain" }}
        />
        <Text className="font-bold text-3xl text-white ">VENDORS</Text>
      </View>

      <View className="bg-black rounded-t-[50px] flex flex-col justify-around h-2/3 p-6">
        <View>
          <Text
            className="font-bold text-4xl text-white text-center"
            style={{ fontFamily: "Sora_700Bold" }}
          >
            Welcome Back!
          </Text>
          <Text
            className="text-[#808080] text-center"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Enter your details to continue
          </Text>
        </View>

        <View className="flex flex-col gap-10 items-center justify-around h-max">
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
            {/* Forgot Password */}
            <TouchableOpacity className="self-end">
              <Text className="text-[#D7FC70] text-sm">
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-[#D7FC70] rounded-xl py-8 flex items-center"
        >
          <Text className="text-black text-2xl font-semibold">Log In</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <Text className="text-white text-center">
          Don't have an account?{" "}
          <Text
            className="text-[#D7FC70]"
            onPress={() => router.push("/vendor/signup")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;
