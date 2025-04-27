import React from "react";
import { ImageBackground, View } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../assets/images/bg2.webp")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Opacity katmanı */}
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <Box className="flex-1 justify-center items-center px-6">
          <Text className="text-white text-5xl font-bold mb-4 text-center">
            Kelime Oyunu
          </Text>

          <Text className="text-gray-300 text-lg mb-8 text-center">
            Kelimeleri keşfetmeye hazır mısın?
          </Text>

          <Button
            className="w-2/3 bg-green-500  rounded-full"
            onPress={() => {
              router.push("/auth/login");
            }}
          >
            <Text className="text-white text-lg font-semibold">Başla</Text>
          </Button>
        </Box>
      </View>
    </ImageBackground>
  );
}
