import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "@/constants/urls/apiUrl";
import { getToken } from "@/utils/storage";

export default function TestScreen() {
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState("");

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
          socketRef.current?.emit("authenticate", token);
        } else {
          console.log("❌ Token bulunamadı.");
        }
      });

      socketRef.current.on("buttonResponse", (data: string) => {
        setMessage(data);
      });

      socketRef.current.on("unauthorized", () => {
        setMessage("Yetkisiz giriş. Lütfen tekrar giriş yapın.");
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

  const handleButtonClick = () => {
    socketRef.current?.emit("buttonClicked");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <TouchableOpacity
        onPress={handleButtonClick}
        className="bg-blue-500 px-6 py-3 rounded-xl mb-4"
      >
        <Text className="text-white font-semibold">Butona Tıkla</Text>
      </TouchableOpacity>
      <Text className="text-lg text-gray-800 text-center">{message}</Text>
    </View>
  );
}
