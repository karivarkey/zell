import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { AuthProvider } from "@/hooks/AuthProvider";
import { Text } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InterThin: require("../node_modules/@expo-google-fonts/inter/Inter_100Thin.ttf"),
    InterExtraLight: require("../node_modules/@expo-google-fonts/inter/Inter_200ExtraLight.ttf"),
    InterLight: require("../node_modules/@expo-google-fonts/inter/Inter_300Light.ttf"),
    InterRegular: require("../node_modules/@expo-google-fonts/inter/Inter_400Regular.ttf"),
    InterMedium: require("../node_modules/@expo-google-fonts/inter/Inter_500Medium.ttf"),
    InterSemiBold: require("../node_modules/@expo-google-fonts/inter/Inter_600SemiBold.ttf"),
    InterBold: require("../node_modules/@expo-google-fonts/inter/Inter_700Bold.ttf"),
    InterExtraBold: require("../node_modules/@expo-google-fonts/inter/Inter_800ExtraBold.ttf"),
    InterBlack: require("../node_modules/@expo-google-fonts/inter/Inter_900Black.ttf"),
    SoraThin: require("../node_modules/@expo-google-fonts/sora/Sora_100Thin.ttf"),
    SoraExtraLight: require("../node_modules/@expo-google-fonts/sora/Sora_200ExtraLight.ttf"),
    SoraLight: require("../node_modules/@expo-google-fonts/sora/Sora_300Light.ttf"),
    SoraRegular: require("../node_modules/@expo-google-fonts/sora/Sora_400Regular.ttf"),
    SoraMedium: require("../node_modules/@expo-google-fonts/sora/Sora_500Medium.ttf"),
    SoraSemiBold: require("../node_modules/@expo-google-fonts/sora/Sora_600SemiBold.ttf"),
    SoraBold: require("../node_modules/@expo-google-fonts/sora/Sora_700Bold.ttf"),
    SoraExtraBold: require("../node_modules/@expo-google-fonts/sora/Sora_800ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
