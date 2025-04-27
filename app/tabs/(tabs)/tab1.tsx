import EditScreenInfo from "@/components/EditScreenInfo";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { logout } from "@/service/auth";

import React from "react";

import { TouchableOpacity } from "react-native";

export default function Tab2() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };
  return (
    <Center className="flex-1">
      <Divider className="my-[30px] w-[80%]" />
      <TouchableOpacity
        onPress={handleLogout}
        className="w-full bg-orange-300 py-3 rounded-xl mt-2"
      >
        <Text className="text-center text-white font-semibold text-lg">
          Çıkış Yap
        </Text>
      </TouchableOpacity>
      <EditScreenInfo path="app/(app)/(tabs)/tab1.tsx" />
    </Center>
  );
}
