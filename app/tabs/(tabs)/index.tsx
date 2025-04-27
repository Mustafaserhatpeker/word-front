import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { logout } from "@/service/auth";
import { getToken } from "@/utils/storage";
import React, { useEffect, useState } from "react";
import { getUser } from "@/service/user";
import LottieView from "lottie-react-native";
import { View } from "@/components/Themed";
import {
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Box } from "@/components/ui/box";

// Tip
type UserData = {
  _id: string;
  email: string;
  username: string;
  __v: number;
};

// Image ve Scene importları
import bronzeIcon from "../../../assets/images/avatars/l1.png";
import silverIcon from "../../../assets/images/avatars/l2.png";
import goldIcon from "../../../assets/images/avatars/l3.png";
import diamondIcon from "../../../assets/images/avatars/l4.png";
import masterIcon from "../../../assets/images/avatars/l5.png";
import champIcon from "../../../assets/images/avatars/l6.png";
import defaultIcon from "../../../assets/images/avatars/lno.png";

import l1scene from "../../../assets/scenes/l1.json";
import l2scene from "../../../assets/scenes/l2.json";
import l3scene from "../../../assets/scenes/l3.json";
import l4scene from "../../../assets/scenes/l4.json";
import l5scene from "../../../assets/scenes/l5.json";
import l6scene from "../../../assets/scenes/l6.json";
import { VStack } from "@/components/ui/vstack";

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
    l5: masterIcon,
    l6: champIcon,
    default: defaultIcon,
  };

  const scenes: Record<string, any> = {
    l1: l1scene,
    l2: l2scene,
    l3: l3scene,
    l4: l4scene,
    l5: l5scene,
    l6: l6scene,
    default: l1scene,
  };

  const currentIcon = images[leagueIcon || "default"];
  const currentScene = scenes[leagueIcon || "default"];

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

    const calculateLeague = (userScore: number) => {
      if (userScore === 0) {
        setLeague("Yok");
        setLeagueIcon("default");
      } else if (userScore > 0 && userScore <= 199) {
        setLeague("Bronz");
        setLeagueIcon("l1");
      } else if (userScore >= 200 && userScore <= 399) {
        setLeague("Gümüş");
        setLeagueIcon("l2");
      } else if (userScore >= 400 && userScore <= 599) {
        setLeague("Altın");
        setLeagueIcon("l3");
      } else if (userScore >= 600 && userScore <= 799) {
        setLeague("Elmas");
        setLeagueIcon("l4");
      } else if (userScore >= 800 && userScore <= 1199) {
        setLeague("Usta");
        setLeagueIcon("l5");
      } else {
        setLeague("Titan");
        setLeagueIcon("l6");
      }
    };

    checkLoginStatus();
    const exampleScore = 0; // örnek skor
    setScore(exampleScore);
    calculateLeague(exampleScore);
  }, [router]);

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
                  <Text className="text-white align-middle font-bold text-2xl ml-2 mt-2">
                    {league}
                  </Text>
                  <LottieView
                    source={currentScene}
                    autoPlay
                    loop
                    style={{ width: 50, height: 50 }}
                  />
                </View>
              </View>
            </Box>
          </View>
          <View
            style={{ backgroundColor: "#FDF6E8" }}
            className="w-full flex flex-col justify-center items-center mt-4"
          >
            <TouchableOpacity className="w-11/12  bg-orange-300 py-3 rounded-xl mt-2">
              <Text className="text-center text-white font-semibold text-lg">
                Oyun Başlat
              </Text>
            </TouchableOpacity>
            <ScrollView
              style={{
                backgroundColor: "#FDF6E8",
                maxHeight: 428,
              }} // max-h-96 = 384px
              className="w-full mt-6"
            >
              <VStack space="xs" className="bg-secondary-400" reversed={false}>
                <Box className=" flex flex-col justify-start p-4 h-40 w-full bg-orange-300  ">
                  <Text className="text-white font-bold text-lg ">
                    Sıra Sende
                  </Text>
                </Box>
                <Box className="h-40 w-full bg-orange-300"></Box>
                <Box className="h-40 w-full bg-orange-300"></Box>
                <Box className="h-40 w-full bg-orange-300"></Box>
              </VStack>
            </ScrollView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
