import React from "react";
import { ImageBackground } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../assets/images/bg.webp")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <Box className="flex-1">
        <Text>selam</Text>
        <Button
          onPress={() => {
            router.push("/auth/login");
          }}
        >
          <Text>Click me</Text>
        </Button>
      </Box>
    </ImageBackground>
  );
}
