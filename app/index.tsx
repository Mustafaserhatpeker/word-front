import React from "react";

import { Box } from "@/components/ui/box";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  return (
    <Box className="flex-1 h-[100vh]">
      <Text>selam</Text>
      <Button
        onPress={() => {
          router.push("/auth/login");
        }}
      >
        <Text>Click me</Text>
      </Button>
    </Box>
  );
}
