import { Text, View, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { Image } from "expo-image";
import Swiper from "react-native-swiper";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Login = () => {
  const router = useRouter();
  const swiperRef = useRef<Swiper | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload images (STATICALLY REQUIRED)
  const imageMap: Record<string, any> = {
    "1.png": require("../assets/images/splash/1.png"),
    "2.png": require("../assets/images/splash/2.png"),
    "3.png": require("../assets/images/splash/3.png"),
  };

  const data = [
    {
      heading: "Discover your locality",
      subHeading:
        "Browse thousands of products, from fashion to tech. Find what you love, around you.",
      image: "1.png",
    },
    {
      heading: "Hassle-Free Usage",
      subHeading:
        "Simple UI with a one-stop solution for Accommodation and Goods.",
      image: "2.png",
    },
    {
      heading: "Easy and Happy Shopping",
      subHeading: "Start shopping now and enjoy a world of convenience!",
      image: "3.png",
    },
  ];

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      swiperRef.current?.scrollBy(1);
    } else {
      router.push("/login"); // Navigate on last slide
    }
  };

  return (
    <View className="flex-1 flex-col justify-center bg-[#111111]">
      {/* Swiper for Images */}
      <StatusBar style="light" />
      <View className="w-full h-2/3">
        <Swiper
          ref={swiperRef}
          loop={false}
          onIndexChanged={setCurrentIndex} // Update state
          showsPagination
          scrollEnabled={true}
          paginationStyle={{ bottom: 40 }}
          activeDotStyle={{
            backgroundColor: "#D7FC70",
            width: 20,
            height: 8,
            borderRadius: 5,
          }}
          dotStyle={{
            backgroundColor: "#ddd",
            width: 5,
            height: 5,
            borderRadius: 4,
          }}
        >
          {data.map((item, i) => (
            <View key={i} className="flex-1 items-center justify-center">
              <Image
                source={imageMap[item.image]}
                style={{ width: 400, height: 400 }}
              />
            </View>
          ))}
        </Swiper>
      </View>
      <View className="bg-black h-1/3 rounded-t-[50px] pt-14 flex flex-col justify-between">
        {/* Text Below Swiper */}
        <View>
          <View className="px-6 pb-10">
            <Text
              className="text-4xl  text-center text-white"
              style={{ fontFamily: "Sora_700Bold" }}
            >
              {data[currentIndex].heading}
            </Text>
            <Text
              className="text-xl text-[#808080] text-center mt-2 px-10"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              {data[currentIndex].subHeading}
            </Text>
          </View>

          {/* Button */}
          <View className="px-10 ">
            <TouchableOpacity
              className=" bg-[#D7FC70] py-5 rounded-2xl px-10"
              onPress={handleNext}
            >
              <Text
                className="text-black text-2xl text-center"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                {currentIndex === data.length - 1 ? "Get Started" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row justify-center  pb-4 gap-1">
          <Text
            className="text-[#808080]"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Vendor?
          </Text>
          <Link href={"/vendor/login"}>
            <Text
              className="text-[#FBFBFB]"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              Login here
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Login;
