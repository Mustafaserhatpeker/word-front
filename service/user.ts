import axios from "axios";
import { getToken } from "@/utils/storage";
import { endpoints } from "@/constants/urls/apiUrl";

export const getUser = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Token bulunamadı");
    }

    const response = await axios.get(endpoints.user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Kullanıcı bilgilerini alma hatası:", error);
    throw error;
  }
};
