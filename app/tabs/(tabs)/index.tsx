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
    <Center className="flex-1">
      <Divider />
      <Heading>Welcome to the Word Game!</Heading>
      {/* userData varsa username'ı göster */}
      <Text>{userData?.username}</Text>
      <Button
        onPress={() => {
          handleLogout();
        }}
      >
        <Text>Quit</Text>
      </Button>
    </Center>
  );
}
