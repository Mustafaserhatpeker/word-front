import React, { useEffect } from "react";
import { ImageBackground, View } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { getToken } from "@/utils/storage";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        router.replace("/tabs");
      }
    };
    checkToken();
  }, []);
  return (
    <ImageBackground
      source={require("../assets/images/r8.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Opacity katmanı */}
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <Box className="flex-1  justify-center items-center px-6">
          <Text className="text-white text-5xl font-bold mb-4 text-center">
            WorDox
          </Text>

          <Text className="text-gray-300 text-lg mb-8 text-center">
            WorDox'a hoş geldiniz! Kelime oyunlarıyla eğlenceli bir yolculuğa
            çıkmaya hazır mısınız? Hadi başlayalım!
          </Text>

          <Button
            className="w-2/3  bg-orange-300 h-12  rounded-full"
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
