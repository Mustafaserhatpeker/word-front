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
    socketRef.current?.emit("sendWord", {
      roomId: currentRoom,
      word: inputWord,
    });
    setInputWord("");
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
            {messageLog.map((msg, i) => (
              <Text key={i} className="text-lg text-gray-800 my-1">
                {msg}
              </Text>
            ))}
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
            />
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
