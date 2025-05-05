import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "@/constants/urls/apiUrl";
import { getToken } from "@/utils/storage";

export default function TestScreen() {
  const socketRef = useRef<Socket | null>(null);
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string>(""); // Oda ID'si için state
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal görünürlüğü
  const [inputWord, setInputWord] = useState<string>(""); // Kullanıcının girdiği kelime

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
      });

      socketRef.current.on("wordResponse", (data: string) => {
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

    initializeSocket();
  }, []);

  const handleJoinRoom = () => {
    if (!roomId) {
      setMessageLog(["Lütfen geçerli bir oda ID'si girin."]);
      return;
    }

    setCurrentRoom(roomId);
    socketRef.current?.emit("joinRoom", roomId);
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socketRef.current?.emit("leaveRoom", currentRoom);
      setMessageLog([]);
      setCurrentRoom(null);
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true); // Modal aç
  };

  const handleSendWord = () => {
    if (currentRoom && inputWord) {
      socketRef.current?.emit("sendWord", {
        roomId: currentRoom,
        word: inputWord,
      });
      setIsModalVisible(false); // Modal kapat
      setInputWord(""); // Girdi alanını temizle
    } else {
      setMessageLog(["Lütfen bir kelime girin ve odaya katılın."]);
    }
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
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={handleOpenModal}
            className="bg-blue-500 px-6 py-3 rounded-xl mb-4"
          >
            <Text className="text-white font-semibold">Kelime Gir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLeaveRoom}
            className="bg-red-500 px-6 py-3 rounded-xl mb-4"
          >
            <Text className="text-white font-semibold">Odadan Ayrıl</Text>
          </TouchableOpacity>
          <ScrollView className="flex-1 w-full px-4">
            {messageLog.map((msg, index) => (
              <Text key={index} className="text-lg text-gray-800 my-1">
                {msg}
              </Text>
            ))}
          </ScrollView>
        </>
      )}

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
          <View className="bg-white w-3/4 p-6 rounded-lg shadow-lg">
            <Text className="text-lg font-semibold mb-4">Bir Kelime Girin</Text>
            <TextInput
              value={inputWord}
              onChangeText={setInputWord}
              placeholder="Kelimenizi yazın"
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <TouchableOpacity
              onPress={handleSendWord}
              className="bg-blue-500 px-6 py-3 rounded-xl mb-4"
            >
              <Text className="text-white font-semibold">Tamam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              className="bg-gray-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
