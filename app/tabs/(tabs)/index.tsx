import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { logout } from "@/service/auth";
import { getToken } from "@/utils/storage";
import { useEffect, useState } from "react";
import { getUser } from "@/service/user";
import { View } from "@/components/Themed";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Box } from "@/components/ui/box";

// userData'nın tipi
type UserData = {
  _id: string;
  email: string;
  username: string;
  __v: number;
};

export default function Home() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/auth/login");
      } else {
        try {
          const response = await getUser();
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          router.replace("/auth/login");
        }
      }
    };

    checkLoginStatus();
  }, [router]);

  return (
    <ImageBackground
      source={require("../../../assets/images/r8.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        className="flex-1 h-full  place-items-start justify-start  py-6 "
        style={{ flex: 1, backgroundColor: "#FDF6E8" }}
      >
        <View
          style={{ backgroundColor: "#FDF6E8" }}
          className="w-full max-w-md p-4 pt-2  border-b-2 border-orange-800 "
        >
          <Text className="text-lg  mb-2  text-orange-950 font-bold">
            Hoş Geldin {userData?.username}!
          </Text>
        </View>

        <View
          style={{ backgroundColor: "#FDF6E8" }}
          className="min-h-96  w-full max-w-md   "
        >
          <View className="w-full flex flex-row justify-between items-center">
            <Box
              className="p-4 w-1/2 flex flex-col "
              style={{ backgroundColor: "#E99B43" }}
            >
              <Text className="text-white font-bold">WorDox Skoru</Text>
              <Text>selam</Text>
            </Box>
            <Box
              className="p-4 w-1/2 flex flex-col "
              style={{ backgroundColor: "#E99B43" }}
            >
              <Text className="text-white font-bold">WorDox Ligi</Text>
              <Text>selam</Text>
            </Box>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="w-full bg-orange-300 py-3 rounded-xl mt-2"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Çıkış Yap
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
