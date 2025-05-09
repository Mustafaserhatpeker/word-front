import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/service/auth";
import { getToken } from "@/utils/storage";
export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = async () => {
    console.log("Giriş Yapma İşlemi");
    if (username.trim() !== "") {
      await login(username, password).then((response) => {
        if (response.status === "success") {
          router.replace("/tabs/(tabs)/home");
        }
      });
    } else {
      console.log("Kullanıcı adı boş olamaz.");
    }
  };
  const handleRegister = () => {
    // Kayıt olma işlemleri burada yapılabilir
    console.log("Kayıt Olma İşlemi");
    router.push("/auth/register");
  };
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        router.replace("/tabs/(tabs)/home");
      }
    };
    checkToken();
  }, []);
  return (
    <ImageBackground
      source={require("../../assets/images/r8.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        className="flex-1 place-items-center justify-center px-6"
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <Text className="text-3xl font-bold text-center text-white mb-6">
          WorDox'a Hoş Geldiniz
        </Text>
        <View className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
          <Text className="text-lg font-medium mb-2 text-gray-700">
            Kullanıcı Adı
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Bir kullanıcı adı girin"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Şifre girin"
            secureTextEntry={true}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
          />
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full bg-orange-300 py-3 rounded-xl mt-2"
          >
            <Text className="text-center text-white font-semibold text-lg">
              Giriş Yap
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRegister}
            className="w-full bg-orange-300 py-3 rounded-xl mt-2"
          >
            <Text className="text-center text-white font-semibold text-lg">
              Üye Ol
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
