import axios from "axios";

import { endpoints } from "@/constants/urls/apiUrl";
import { removeToken, saveToken } from "@/utils/storage";

// Giriş Fonksiyonu
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(endpoints.login, {
      email,
      password,
    });

    if (response.data.status === "success") {
      const token = response.data.data.token;
      await saveToken(token);

      return response.data;
    } else {
      console.error("Giriş başarısız:", response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    const response = await axios.post(endpoints.register, {
      email,
      username,
      password,
    });
    if (response.data.status === "success") {
      return response.data;
    } else {
      console.error("Kayıt başarısız:", response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await removeToken();
    console.log("Çıkış yapıldı.");
  } catch (error) {
    console.error("Çıkış yapma hatası:", error);
  }
};
