import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "@/constants/urls/apiUrl";
import { getToken } from "@/utils/storage";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import Entypo from "@expo/vector-icons/Entypo";

function generateRandomLettersWithVowels(count = 7, minVowels = 2) {
  const vowels = "AEIİOÖUÜ";
  const consonants = "BCÇDFGĞHJKLMNPRSŞTVYZ";

  const selectedVowels = Array.from(
    { length: minVowels },
    () => vowels[Math.floor(Math.random() * vowels.length)]
  );

  const remainingLetters = Array.from(
    { length: count - minVowels },
    () => consonants[Math.floor(Math.random() * consonants.length)]
  );

  const allLetters = [...selectedVowels, ...remainingLetters];
  return allLetters.sort(() => Math.random() - 0.5);
}

export default function TestScreen() {
  const socketRef = useRef<Socket | null>(null);
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [inputWord, setInputWord] = useState<string>("");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [randomLetters, setRandomLetters] = useState<string[]>(
    generateRandomLettersWithVowels(7, 2)
  );

  useEffect(() => {
    const initializeSocket = async () => {
      const token = await getToken();

      // Socket bağlantısını başlat
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
      });

      socketRef.current.on("connect", () => {
        console.log("🔌 Socket bağlı:", socketRef.current?.id);

        if (token) {
          console.log("✅ Token gönderiliyor:", token);
          socketRef.current?.emit("authenticate", { token });
          setIsConnected(true);
        } else {
          console.log("❌ Token bulunamadı.");
        }
      });

      socketRef.current.on("roomHistory", (history: string[]) => {
        setMessageLog(history); // Oda geçmişini güncelle
        setIsWaiting(false); // Bekleme durumunu kaldır
      });

      socketRef.current.on("systemMessage", (data: string) => {
        setMessageLog((prevLog) => [...prevLog, data]);
      });

      socketRef.current.on("wordResponse", (data: string) => {
        setMessageLog((prevLog) => [...prevLog, data]);
      });

      socketRef.current.on("waiting", (message: string) => {
        setIsWaiting(true); // Bekleme durumunu etkinleştir
        setMessageLog([message]); // Bekleme mesajını güncelle
      });

      socketRef.current.on("unauthorized", () => {
        setMessageLog(["Yetkisiz giriş. Lütfen tekrar giriş yapın."]);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          console.log("🔌 Socket bağlantısı kapatıldı");
        }
      };
    };

    initializeSocket();
  }, []);

  const handleJoinRoom = () => {
    if (!roomId) {
      setMessageLog(["Lütfen geçerli bir oda ID'si girin."]);
      return;
    }

    const timerDuration = 0.5;

    setCurrentRoom(roomId);
    socketRef.current?.emit("joinRoom", { roomId, timerDuration });
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socketRef.current?.emit("leaveRoom", currentRoom);
      setMessageLog([]);
      setCurrentRoom(null);
      setIsWaiting(false); // Bekleme durumunu sıfırla
    }
  };

  const handleSendWord = () => {
    if (currentRoom && inputWord) {
      socketRef.current?.emit("sendWord", {
        roomId: currentRoom,
        word: inputWord,
      });

      setInputWord(""); // Girdi alanını temizle
    } else {
      setMessageLog(["Lütfen bir kelime girin ve odaya katılın."]);
    }
  };

  const handleLetterPress = (letter: string) => {
    setInputWord((prevWord) => prevWord + letter); // Basılan harfi kelimeye ekle
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      {!currentRoom ? (
        <>
          <TextInput
            value={roomId}
            onChangeText={setRoomId}
            placeholder="Oda ID'si girin"
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-3/4"
          />
          <TouchableOpacity
            onPress={handleJoinRoom}
            className="bg-blue-500 px-6 py-3 rounded-xl mb-4"
          >
            <Text className="text-white font-semibold">Odaya Katıl</Text>
          </TouchableOpacity>
          {isWaiting && (
            <Text className="text-blue-500 font-semibold">
              Diğer kullanıcı bekleniyor...
            </Text>
          )}
        </>
      ) : (
        <>
          <ScrollView className="flex-1 w-full px-4">
            {messageLog.map((msg, index) => (
              <Text key={index} className="text-lg text-gray-800 my-1">
                {msg}
              </Text>
            ))}
          </ScrollView>
          <View className="absolute bottom-0 left-0 right-0 bg-white p-4 flex flex-col justify-between">
            <View className="flex flex-row items-center justify-start gap-2 w-full h-18  rounded-lg  mb-4">
              <TouchableOpacity
                onPress={handleLeaveRoom}
                className="bg-orange-500 px-6 py-3 rounded-xl "
              >
                <Text className="text-white font-semibold">Odadan Ayrıl</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLeaveRoom}
                className="bg-red-500 px-6 py-3 rounded-xl "
              >
                <Text className="text-white font-semibold">Teslim Ol</Text>
              </TouchableOpacity>
            </View>
            <HStack space="md" reversed={false}>
              {randomLetters.map((letter, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleLetterPress(letter)}
                >
                  <Box className="bg-orange-500 w-10 h-10 rounded-lg items-center justify-center">
                    <Text className="text-orange-900 text-3xl font-semibold">
                      {letter}
                    </Text>
                  </Box>
                </TouchableOpacity>
              ))}
            </HStack>
            <View className="flex flex-row  items-center justify-start  gap-2  w-full h-20 bg-orange-200 mt-4 p-2 rounded-lg">
              <Button
                onPress={handleSendWord}
                className="bg-orange-500 rounded-lg w-16 h-16 items-center justify-center"
              >
                <Entypo name="controller-play" size={24} color="white" />
              </Button>
              <Text className="text-gray-500 text-sm mt-2">{inputWord}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
