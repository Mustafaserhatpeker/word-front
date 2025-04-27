import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { logout } from "@/service/auth";
import { getToken } from "@/utils/storage";
import React, { useEffect, useState } from "react";
import { getUser } from "@/service/user";
import { View } from "@/components/Themed";
import { ImageBackground, TouchableOpacity, Image } from "react-native";
import { Box } from "@/components/ui/box";

// userData'nın tipi
type UserData = {
  _id: string;
  email: string;
  username: string;
  __v: number;
};

// İmage importları
import bronzeIcon from "../../../assets/images/avatars/l1.png";
import silverIcon from "../../../assets/images/avatars/l2.png";
import goldIcon from "../../../assets/images/avatars/l3.png";
import diamondIcon from "../../../assets/images/avatars/l4.png";
import platinumIcon from "../../../assets/images/avatars/l5.png";
import defaultIcon from "../../../assets/images/avatars/lno.png";

export default function Home() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [league, setLeague] = useState<string | null>(null);
  const [leagueIcon, setLeagueIcon] = useState<keyof typeof images | null>(
    null
  );

  const images: Record<string, any> = {
    l1: bronzeIcon,
    l2: silverIcon,
    l3: goldIcon,
    l4: diamondIcon,
    l5: platinumIcon, // Platin ikonu için
    default: defaultIcon,
  };

  const currentIcon = images[leagueIcon || "default"];

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

    setScore(100); // Skor örnek olarak 100 olarak ayarlanmış.
    if (score !== null) {
      console.log("Score:", score);
      if (score === 0) {
        setLeague("Yerleştirilmedi");
        setLeagueIcon("default");
      } else if (score > 0 && score <= 199) {
        setLeague("Gümüş");
        setLeagueIcon("l2");
      } else if (score >= 200 && score <= 399) {
        setLeague("Altın");
        setLeagueIcon("l3");
      } else if (score >= 400 && score <= 599) {
        setLeague("Platin");
        setLeagueIcon("l5");
      } else {
        setLeague("Elmas");
        setLeagueIcon("l4");
      }
    }

    checkLoginStatus();
  }, [router, score]);

  return (
    <ImageBackground
      source={require("../../../assets/images/r8.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        className="flex-1 h-full place-items-start justify-start py-6 "
        style={{ flex: 1, backgroundColor: "#FDF6E8" }}
      >
        <View
          style={{ backgroundColor: "#FDF6E8" }}
          className="w-full max-w-md p-4 pt-0 flex flex-row align-middle  border-b-2 border-orange-800  "
        >
          <Image
            source={require("../../../assets/images/avatars/ma1.png")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              alignSelf: "flex-start",
            }}
            resizeMode="contain"
            alt="WorDox Skoru"
          />
          <Text className="text-lg ml-4 align-middle text-orange-950 font-bold">
            Hoş Geldin {userData?.username}!
          </Text>
        </View>

        <View
          style={{ backgroundColor: "#FDF6E8" }}
          className="min-h-96 w-full max-w-md"
        >
          <View className="w-full flex flex-row justify-between items-center border-b-2 border-orange-800">
            <Box
              className="p-4 w-1/2 flex flex-co h-full justify-start place-items-center border-r-2 border-orange-800"
              style={{ backgroundColor: "#E99B43" }}
            >
              <Text className="text-white font-bold">WorDox Skoru</Text>
              <View
                style={{ backgroundColor: "#E99B43" }}
                className="w-full flex flex-row justify-start place-items-center"
              >
                <Image
                  source={require("../../../assets/images/avatars/w.png")}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    marginTop: 10,
                    alignSelf: "flex-start",
                  }}
                  resizeMode="contain"
                  alt="WorDox Skoru"
                />
                <Text className="text-white align-middle font-bold text-2xl mt-2">
                  {score}
                </Text>
              </View>
            </Box>
            <Box
              className="p-4 w-1/2 flex flex-col h-full"
              style={{ backgroundColor: "#E99B43" }}
            >
              <Text className="text-white font-bold justify-self-end">
                WorDox Ligi
              </Text>
              <View
                className="w-full flex flex-col justify-end place-items-end"
                style={{ backgroundColor: "#E99B43" }}
              >
                <View
                  style={{ backgroundColor: "#E99B43" }}
                  className="w-full flex flex-row justify-start place-items-center"
                >
                  <Image
                    source={currentIcon}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 10,
                      marginTop: 10,
                      alignSelf: "flex-start",
                    }}
                    resizeMode="contain"
                    alt="WorDox Skoru"
                  />
                  <Text className="text-white align-middle font-bold text-2xl ml-2">
                    {league}
                  </Text>
                </View>
              </View>
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
