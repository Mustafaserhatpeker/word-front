import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";

import { getToken } from "@/utils/storage";
import React, { useEffect, useState } from "react";
import { getUser } from "@/service/user";
import LottieView from "lottie-react-native";
import { View } from "@/components/Themed";
import SearchGameModal from "@/components/SearchGameModal";
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
import vsscene from "../../../assets/scenes/vs.json";
import { VStack } from "@/components/ui/vstack";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.replace("/auth/login");
        } else {
          const response = await getUser();
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error during login check:", error);
        router.replace("/auth/login");
      } finally {
        setLoading(false);
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
    const exampleScore = 1200; // örnek skor
    setScore(exampleScore);
    calculateLeague(exampleScore);
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../../assets/images/r8.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        className="flex-1 h-full place-items-start justify-start py-8 "
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
            alt="user avatar"
          />
          <Text className="text-lg ml-4 align-middle text-orange-950 font-bold">
            Hoş Geldin {userData?.username}!
          </Text>
        </View>

        <View
          style={{ backgroundColor: "#FDF6E8" }}
          className="min-h-96 w-full max-w-md"
        >
          <View className="w-full flex flex-row justify-between items-center">
            <Box
              className="p-4 w-1/2 flex flex-co h-full justify-start place-items-center "
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
            className="w-full flex flex-col justify-center items-center mt-4 px-2"
          >
            <TouchableOpacity
              onPress={() => {
                setShowModal(true);
              }}
              className="w-full  bg-orange-500 py-3 rounded-xl mt-2"
            >
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
              <VStack
                style={{
                  backgroundColor: "#FDF6E8",
                }}
                space="xs"
                reversed={false}
              >
                <Box className=" flex flex-col justify-start p-2 h-72 w-full bg-orange-400 rounded-xl  ">
                  <Box className="flex flex-row justify-between items-center p-2 rounded-xl ">
                    <Text className="text-white font-bold text-lg ">
                      Hamle Sırası Sende
                    </Text>
                    <Text className="text-white  text-lg ">
                      Kalan Süre :{" "}
                      <Text className="text-white font-bold text-lg">
                        00:00
                      </Text>
                    </Text>
                  </Box>
                  <Box className="flex flex-row justify-center gap-16 items-center p-2 rounded-xl ">
                    <Image
                      source={require("../../../assets/images/avatars/ma1.png")}
                      style={{
                        width: 75,
                        height: 75,
                        borderRadius: 10,
                        alignSelf: "flex-start",
                      }}
                      resizeMode="contain"
                      alt="user avatar"
                    />
                    <View style={{ backgroundColor: "transparent" }}>
                      <LottieView
                        source={vsscene}
                        autoPlay
                        loop
                        style={{
                          width: 60,
                          height: 60,
                          position: "relative",
                        }}
                      />
                      <Text
                        style={{
                          position: "absolute",
                          color: "red",
                          fontWeight: "bold",
                          fontSize: 12,
                          top: 20,
                          left: 22,
                        }}
                      >
                        VS
                      </Text>
                    </View>
                    <Image
                      source={require("../../../assets/images/avatars/ma4.png")}
                      style={{
                        width: 75,
                        height: 75,
                        borderRadius: 10,
                        alignSelf: "flex-start",
                      }}
                      resizeMode="contain"
                      alt="user avatar"
                    />
                  </Box>
                  <View
                    style={{ backgroundColor: "transparent" }}
                    className=" rounded-xl p-2 flex flex-row justify-between items-center "
                  >
                    <View
                      style={{ backgroundColor: "transparent" }}
                      className="flex flex-col justify-start items-center"
                    >
                      <Text className="text-white font-extrabold ">
                        {userData?.username}
                      </Text>
                      <View
                        style={{ backgroundColor: "transparent" }}
                        className=" w-full flex flex-row justify-start items-center"
                      >
                        <Text className="text-white font-extrabold text-lg text-start">
                          120
                        </Text>
                        <Image
                          source={require("../../../assets/images/avatars/w.png")}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            marginTop: 4,

                            alignSelf: "flex-start",
                          }}
                          resizeMode="contain"
                          alt="WorDox Skoru"
                        />
                      </View>
                    </View>

                    <View
                      style={{ backgroundColor: "transparent" }}
                      className="flex flex-col justify-start items-center"
                    >
                      <Text className="text-white font-extrabold ">
                        Uzaylı Adam
                      </Text>
                      <View
                        style={{ backgroundColor: "transparent" }}
                        className=" w-full flex flex-row justify-start items-start"
                      >
                        <Text className="text-white font-extrabold text-lg text-start">
                          120
                        </Text>
                        <Image
                          source={require("../../../assets/images/avatars/w.png")}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            marginTop: 4,

                            alignSelf: "flex-start",
                          }}
                          resizeMode="contain"
                          alt="WorDox Skoru"
                        />
                      </View>
                    </View>
                  </View>
                  <Button className="w-full bg-orange-300 rounded-xl mt-2">
                    <Text className="text-white font-bold text-lg ">
                      Hamle Yap
                    </Text>
                  </Button>
                </Box>
                <Box className=" flex flex-col justify-start p-2 h-72 w-full bg-orange-400 rounded-xl  ">
                  <Box className="flex flex-row justify-between items-center p-2 rounded-xl ">
                    <Text className="text-white font-bold text-lg ">
                      Hamle Sırası Sende
                    </Text>
                    <Text className="text-white  text-lg ">
                      Kalan Süre :{" "}
                      <Text className="text-white font-bold text-lg">
                        00:00
                      </Text>
                    </Text>
                  </Box>
                  <Box className="flex flex-row justify-center gap-16 items-center p-2 rounded-xl ">
                    <Image
                      source={require("../../../assets/images/avatars/ma1.png")}
                      style={{
                        width: 75,
                        height: 75,
                        borderRadius: 10,
                        alignSelf: "flex-start",
                      }}
                      resizeMode="contain"
                      alt="user avatar"
                    />
                    <View style={{ backgroundColor: "transparent" }}>
                      <LottieView
                        source={vsscene}
                        autoPlay
                        loop
                        style={{
                          width: 60,
                          height: 60,
                          position: "relative",
                        }}
                      />
                      <Text
                        style={{
                          position: "absolute",
                          color: "red",
                          fontWeight: "bold",
                          fontSize: 12,
                          top: 20,
                          left: 22,
                        }}
                      >
                        VS
                      </Text>
                    </View>
                    <Image
                      source={require("../../../assets/images/avatars/ma4.png")}
                      style={{
                        width: 75,
                        height: 75,
                        borderRadius: 10,
                        alignSelf: "flex-start",
                      }}
                      resizeMode="contain"
                      alt="user avatar"
                    />
                  </Box>
                  <View
                    style={{ backgroundColor: "transparent" }}
                    className=" rounded-xl p-2 flex flex-row justify-between items-center "
                  >
                    <View
                      style={{ backgroundColor: "transparent" }}
                      className="flex flex-col justify-start items-center"
                    >
                      <Text className="text-white font-extrabold ">
                        {userData?.username}
                      </Text>
                      <View
                        style={{ backgroundColor: "transparent" }}
                        className=" w-full flex flex-row justify-start items-center"
                      >
                        <Text className="text-white font-extrabold text-lg text-start">
                          120
                        </Text>
                        <Image
                          source={require("../../../assets/images/avatars/w.png")}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            marginTop: 4,

                            alignSelf: "flex-start",
                          }}
                          resizeMode="contain"
                          alt="WorDox Skoru"
                        />
                      </View>
                    </View>

                    <View
                      style={{ backgroundColor: "transparent" }}
                      className="flex flex-col justify-start items-center"
                    >
                      <Text className="text-white font-extrabold ">
                        Uzaylı Adam
                      </Text>
                      <View
                        style={{ backgroundColor: "transparent" }}
                        className=" w-full flex flex-row justify-start items-start"
                      >
                        <Text className="text-white font-extrabold text-lg text-start">
                          120
                        </Text>
                        <Image
                          source={require("../../../assets/images/avatars/w.png")}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            marginTop: 4,

                            alignSelf: "flex-start",
                          }}
                          resizeMode="contain"
                          alt="WorDox Skoru"
                        />
                      </View>
                    </View>
                  </View>
                  <Button className="w-full bg-orange-300 rounded-xl mt-2">
                    <Text className="text-white font-bold text-lg ">
                      Hamle Yap
                    </Text>
                  </Button>
                </Box>
                <Box className=" flex flex-col justify-start p-2 h-72 w-full bg-orange-400 rounded-xl  ">
                  <Box className="flex flex-row justify-between items-center p-2 rounded-xl ">
                    <Text className="text-white font-bold text-lg ">
                      Hamle Sırası Sende
                    </Text>
                    <Text className="text-white  text-lg ">
                      Kalan Süre :{" "}
                      <Text className="text-white font-bold text-lg">
                        00:00
                      </Text>
                    </Text>
                  </Box>
                  <Box className="flex flex-row justify-center gap-16 items-center p-2 rounded-xl ">
                    <Image
                      source={require("../../../assets/images/avatars/ma1.png")}
                      style={{
                        width: 75,
                        height: 75,
                        borderRadius: 10,
                        alignSelf: "flex-start",
                      }}
                      resizeMode="contain"
                      alt="user avatar"
                    />
                    <View style={{ backgroundColor: "transparent" }}>
                      <LottieView
                        source={vsscene}
                        autoPlay
                        loop
                        style={{
                          width: 60,
                          height: 60,
                          position: "relative",
                        }}
                      />
                      <Text
                        style={{
                          position: "absolute",
                          color: "red",
                          fontWeight: "bold",
                          fontSize: 12,
                          top: 20,
                          left: 22,
                        }}
                      >
                        VS
                      </Text>
                    </View>
                    <Image
                      source={require("../../../assets/images/avatars/ma4.png")}
                      style={{
                        width: 75,
                        height: 75,
                        borderRadius: 10,
                        alignSelf: "flex-start",
                      }}
                      resizeMode="contain"
                      alt="user avatar"
                    />
                  </Box>
                  <View
                    style={{ backgroundColor: "transparent" }}
                    className=" rounded-xl p-2 flex flex-row justify-between items-center "
                  >
                    <View
                      style={{ backgroundColor: "transparent" }}
                      className="flex flex-col justify-start items-center"
                    >
                      <Text className="text-white font-extrabold ">
                        {userData?.username}
                      </Text>
                      <View
                        style={{ backgroundColor: "transparent" }}
                        className=" w-full flex flex-row justify-start items-center"
                      >
                        <Text className="text-white font-extrabold text-lg text-start">
                          120
                        </Text>
                        <Image
                          source={require("../../../assets/images/avatars/w.png")}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            marginTop: 4,

                            alignSelf: "flex-start",
                          }}
                          resizeMode="contain"
                          alt="WorDox Skoru"
                        />
                      </View>
                    </View>

                    <View
                      style={{ backgroundColor: "transparent" }}
                      className="flex flex-col justify-start items-center"
                    >
                      <Text className="text-white font-extrabold ">
                        Uzaylı Adam
                      </Text>
                      <View
                        style={{ backgroundColor: "transparent" }}
                        className=" w-full flex flex-row justify-start items-start"
                      >
                        <Text className="text-white font-extrabold text-lg text-start">
                          120
                        </Text>
                        <Image
                          source={require("../../../assets/images/avatars/w.png")}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            marginTop: 4,

                            alignSelf: "flex-start",
                          }}
                          resizeMode="contain"
                          alt="WorDox Skoru"
                        />
                      </View>
                    </View>
                  </View>
                  <Button className="w-full bg-orange-300 rounded-xl mt-2">
                    <Text className="text-white font-bold text-lg ">
                      Hamle Yap
                    </Text>
                  </Button>
                </Box>
              </VStack>
            </ScrollView>
          </View>
        </View>
      </View>
      <SearchGameModal showModal={showModal} setShowModal={setShowModal} />
    </ImageBackground>
  );
}
