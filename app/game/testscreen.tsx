import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "@/constants/urls/apiUrl";
import { getToken } from "@/utils/storage";

export default function TestScreen() {
  const socketRef = useRef<Socket | null>(null);
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string>(""); // Oda ID'si için state
  const [isConnected, setIsConnected] = useState<boolean>(false);

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

        if (token && roomId) {
          console.log("✅ Token ve RoomID gönderiliyor:", token, roomId);
          socketRef.current?.emit("authenticate", { token, roomId });
          setIsConnected(true);
        } else {
          console.log("❌ Token veya RoomID bulunamadı.");
        }
      });

      socketRef.current.on("buttonResponse", (data: string) => {
        setMessageLog((prevLog) => [...prevLog, data]);
      });

      socketRef.current.on("systemMessage", (data: string) => {
        setMessageLog((prevLog) => [...prevLog, data]);
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

    if (roomId) {
      initializeSocket();
    }
  }, [roomId]);

  const handleButtonClick = () => {
    socketRef.current?.emit("buttonClicked");
  };

  const handleJoinRoom = () => {
    if (!roomId) {
      setMessageLog(["Lütfen geçerli bir oda ID'si girin."]);
      return;
    }

    setMessageLog((prevLog) => [...prevLog, `Odaya bağlanılıyor: ${roomId}`]);
    // Socket bağlantısını başlatacak
    if (!socketRef.current?.connected) {
      const initializeSocket = async () => {
        const token = await getToken();

        socketRef.current = io(SOCKET_URL, {
          transports: ["websocket"],
          reconnection: true,
        });

        if (token) {
          socketRef.current.emit("authenticate", { token, roomId });
        }
      };

      initializeSocket();
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      {!isConnected ? (
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
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={handleButtonClick}
            className="bg-blue-500 px-6 py-3 rounded-xl mb-4"
          >
            <Text className="text-white font-semibold">Butona Tıkla</Text>
          </TouchableOpacity>
          <View className="flex-1 w-full px-4">
            {messageLog.map((msg, index) => (
              <Text key={index} className="text-lg text-gray-800 my-1">
                {msg}
              </Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
