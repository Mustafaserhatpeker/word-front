import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { register } from "@/service/auth";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = () => {
    if (
      email.trim() === "" ||
      username.trim() === "" ||
      password.trim() === ""
    ) {
      Alert.alert("Hata", "Tüm alanları doldurun.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Hata", "Geçerli bir e-posta adresi girin.");
      return;
    }

    // Şifre doğrulama
    if (!validatePassword(password)) {
      Alert.alert(
        "Hata",
        "Şifre en az 8 karakter olmalı, bir büyük harf, bir küçük harf ve bir noktalama işareti içermelidir."
      );
      return;
    }

    register(email, username, password)
      .then((response) => {
        if (response.status === "success") {
          Alert.alert("Başarılı", "Kayıt işlemi başarılı.");
          router.replace("/auth/login");
        } else {
          Alert.alert("Hata", response.message);
        }
      })
      .catch((error) => {
        console.error("Kayıt hatası:", error);
        Alert.alert("Hata", "Kayıt işlemi sırasında bir hata oluştu.");
      });
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

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
          WorDox'a Kaydolun
        </Text>

        <View className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
          <Text className="text-lg font-medium mb-2 text-gray-700">
            E-posta
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="E-posta adresinizi girin"
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
          />

          <Text className="text-lg font-medium mb-2 text-gray-700">
            Kullanıcı Adı
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Bir kullanıcı adı seçin"
            autoCapitalize="none"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
          />

          <Text className="text-lg font-medium mb-2 text-gray-700">Şifre</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Bir şifre belirleyin"
            secureTextEntry
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
          />
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          className="w-full bg-orange-300 py-3 rounded-xl mt-2"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Kayıt Ol
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogin}
          className="w-full bg-orange-300 py-3 rounded-xl mt-2"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Giriş Yap
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
