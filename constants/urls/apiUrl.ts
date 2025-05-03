export const BASE_URL = "http://10.33.10.202:5001/api";

export const endpoints = {
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/auth/register`,
  user: `${BASE_URL}/users/get-user`,
};
