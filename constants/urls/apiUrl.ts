export const BASE_URL = "http://192.168.56.219:5001/api";
export const SOCKET_URL = "http://192.168.56.219:5001";
export const endpoints = {
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/auth/register`,
  user: `${BASE_URL}/users/get-user`,
};
