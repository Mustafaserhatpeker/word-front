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
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";

// userData'nın tipi
type UserData = {
  _id: string;
  email: string;
  username: string;
  __v: number;
};

export default function Home() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null); // userData tipi ayarlandı

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken(); // getToken, async bir fonksiyon olabilir
      if (!token) {
        router.replace("/auth/login");
      } else {
        try {
          const response = await getUser(); // getUser, userData döndürüyor
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
    <View className="flex-1 items-center justify-center px-4 py-4">
      <View className="w-full h-full max-w-md  dark:bg-white rounded-2xl shadow-lg">
        <Text className="text-lg font-medium mb-2 text-gray-700">
          Hoş Geldin {userData?.username}!
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
          className="w-full bg-indigo-500 py-3 rounded-xl mt-2"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Çıkış Yap
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
