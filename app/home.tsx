import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import * as Location from "expo-location";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Toast } from "toastify-react-native";
import Header from "@/components/home/Header";
const Home = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Permission Denied");
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      let reverseGeocode = await Location.reverseGeocodeAsync(loc.coords);
      if (reverseGeocode.length > 0) {
        console.log(reverseGeocode);
        setLocation(reverseGeocode[0].formattedAddress || "Error");
      } else {
        setLocation("Location not found");
      }
      setLoading(false);
    })();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Toast.success("Signed Out Successfully!", "bottom");
    } catch (error: any) {
      Toast.error(`Sign Out Failed: ${error.message}`, "bottom");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111] items-center justify-between">
      <View className="w-full px-5">
        <Header location={location || "Fetching Location..."} />
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-[#D7FC70] flex-row items-center justify-center gap-2 py-4 px-6 rounded-xl"
      >
        <Ionicons name="log-out-outline" size={24} color="black" />
        <Text className="text-black text-xl font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
