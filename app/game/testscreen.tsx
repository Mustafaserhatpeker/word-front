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
import { jwtDecode } from "jwt-decode";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { generateMatrix } from "@/utils/generateMatrix";
import GameButton from "@/components/GameButton";
const colorMap = new Map<string, string>();
const colorPalette = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9844a",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#577590",
  "#277da1",
  "#4d908e",
  "#b5838d",
  "#6a4c93",
];
let colorIndex = 0;

const getColorForKey = (letter: string, points: number | null): string => {
  if (letter === "" || points === null) return "#ccc";
  const key = `${letter}-${points}`;
  if (!colorMap.has(key)) {
    colorMap.set(key, colorPalette[colorIndex % colorPalette.length]);
    colorIndex++;
  }
  return colorMap.get(key)!;
};
export default function TestScreen() {
  const socketRef = useRef<Socket | null>(null);
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [inputWord, setInputWord] = useState<string>("");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerDuration, setTimerDuration] = useState(30 * 60); // default 2 dk
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedButtons, setSelectedButtons] = useState<
    { row: number; col: number }[]
  >([]);

  const [randomLetters, setRandomLetters] = useState<string[]>(
    generateRandomLettersWithVowels(7, 2) // 7 harf, en az 2 sesli harf
  );
  const [matrix, setMatrix] = useState<
    { letter: string; points: number | null }[][]
  >([]);
  function generateRandomLettersWithVowels(count = 7, minVowels = 2) {
    const vowels = "AEIİOÖUÜ";
    const consonants = "BCÇDFGĞHJKLMNPRSŞTVYZ";

    // Öncelikle minimum sayıda sesli harf ekle
    const selectedVowels = Array.from(
      { length: minVowels },
      () => vowels[Math.floor(Math.random() * vowels.length)]
    );

    // Kalan harfleri oluştur
    const remainingLetters = Array.from(
      { length: count - minVowels },
      () => consonants[Math.floor(Math.random() * consonants.length)]
    );

    // Sesli harfleri ve diğer harfleri birleştir ve karıştır
    const allLetters = [...selectedVowels, ...remainingLetters];
    return allLetters.sort(() => Math.random() - 0.5); // Harfleri karıştır
  }
  const handleLetterPress = (letter: string) => {
    setInputWord((prevWord) => prevWord + letter); // Basılan harfi kelimeye ekle
  };
  const handleMatrixButtonPress = (row: number, col: number) => {
    const isSelected = selectedButtons.some(
      (b) => b.row === row && b.col === col
    );

    if (isSelected) {
      // Seçimi iptal et
      setSelectedButtons((prev) =>
        prev.filter((b) => !(b.row === row && b.col === col))
      );
      return;
    }

    if (selectedButtons.length === 0) {
      setSelectedButtons([{ row, col }]);
      return;
    }

    const last = selectedButtons[selectedButtons.length - 1];
    const rowDiff = Math.abs(row - last.row);
    const colDiff = Math.abs(col - last.col);

    const isAdjacent = rowDiff <= 1 && colDiff <= 1;

    if (!isAdjacent) {
      alert("Yalnızca komşu butonları seçebilirsiniz!");
      return;
    }

    if (selectedButtons.length < inputWord.length) {
      setSelectedButtons((prev) => [...prev, { row, col }]);
    }
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const token = await getToken();
      if (token) {
        const decoded: any = jwtDecode(token);
        if (decoded?.username) {
          setUsername(decoded.username);
        }
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (activePlayer === username && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [remainingTime, activePlayer, username]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const initializeSocket = async () => {
      const token = await getToken();

      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
      });

      socketRef.current.on("connect", () => {
        if (token) {
          socketRef.current?.emit("authenticate", { token });
          setIsConnected(true);
          const newMatrix = generateMatrix();
          setMatrix(newMatrix);
        }
      });

      socketRef.current.on("roomHistory", (history: string[]) => {
        setMessageLog(history);
        setIsWaiting(false);
      });

      socketRef.current.on("systemMessage", (data: string) => {
        setMessageLog((prev) => [...prev, data]);
      });

      socketRef.current.on("wordResponse", (data: string) => {
        setMessageLog((prev) => [...prev, data]);
      });

      socketRef.current.on("waiting", (msg: string) => {
        setIsWaiting(true);
        setMessageLog([msg]);
      });

      socketRef.current.on("unauthorized", () => {
        setMessageLog(["Yetkisiz giriş. Lütfen tekrar giriş yapın."]);
      });

      socketRef.current.on("turnChange", (newActivePlayer: string) => {
        setActivePlayer(newActivePlayer);
        if (newActivePlayer === username) {
          setRemainingTime(timerDuration);
        } else {
          setRemainingTime(0);
        }
      });
    };

    initializeSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [username]);

  const handleJoinRoom = () => {
    if (!roomId) return;
    setCurrentRoom(roomId);
    socketRef.current?.emit("joinRoom", { roomId, timerDuration });
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socketRef.current?.emit("leaveRoom", currentRoom);
      setMessageLog([]);
      setCurrentRoom(null);
      setIsWaiting(false);
    }
  };

  const handleSendWord = () => {
    if (!currentRoom || !inputWord) return;

    if (selectedButtons.length !== inputWord.length) {
      alert("Kelime uzunluğu kadar komşu buton seçmelisiniz!");
      return;
    }

    const newMatrix = [...matrix];
    selectedButtons.forEach((pos, index) => {
      newMatrix[pos.row][pos.col] = {
        letter: inputWord[index],
        points: inputWord.length, // her harf için kelime uzunluğu kadar puan
      };
    });

    setMatrix(newMatrix);
    socketRef.current?.emit("sendWord", {
      roomId: currentRoom,
      word: inputWord,
    });

    setInputWord("");
    setSelectedButtons([]);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white ">
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
          <ScrollView className="flex-1 w-full px-4 ">
            {messageLog.map((msg, i) => (
              <Text key={i} className="text-lg text-gray-800 my-1">
                {msg}
              </Text>
            ))}
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {matrix.map((row, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: "row" }}>
                  {row.map((cell, cellIndex) => (
                    <GameButton
                      key={cellIndex}
                      TopLeftText={
                        cell.points !== null ? cell.points.toString() : ""
                      }
                      MiddleText={cell.letter}
                      backgroundColor={getColorForKey(cell.letter, cell.points)}
                      onPress={() =>
                        handleMatrixButtonPress(rowIndex, cellIndex)
                      }
                      style={{
                        borderWidth: selectedButtons.some(
                          (b) => b.row === rowIndex && b.col === cellIndex
                        )
                          ? 2
                          : 0,
                        borderColor: selectedButtons.some(
                          (b) => b.row === rowIndex && b.col === cellIndex
                        )
                          ? "green"
                          : "transparent",
                      }}
                    />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 bg-white p-4">
            <View className="mb-2">
              {activePlayer === username ? (
                <Text className="text-green-600 font-bold text-lg">
                  Sıra sizde! Süre: {formatTime(remainingTime)}
                </Text>
              ) : (
                <Text className="text-gray-600 font-semibold">
                  Bekleniyor... Sıra: {activePlayer || "Bilinmiyor"}
                </Text>
              )}
            </View>

            <View className="flex-row justify-start mb-3 gap-2">
              <TouchableOpacity
                onPress={handleLeaveRoom}
                className="bg-orange-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">Odadan Ayrıl</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLeaveRoom}
                className="bg-orange-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">Pes Et</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              value={inputWord}
              onChangeText={setInputWord}
              placeholder="Kelimenizi yazın"
              className="border border-gray-300 rounded-lg px-4 py-2 mb-2"
              editable={false}
            />
            <View className="flex-row justify-center mb-2">
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
            </View>
            <TouchableOpacity
              onPress={handleSendWord}
              className="bg-green-500 px-4 py-3 rounded-xl"
              disabled={activePlayer !== username}
            >
              <Text className="text-white font-semibold text-center">
                Kelimeyi Gönder
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
