import axios from "axios";
import { API_BASE } from "../constants";

import TokenService from "./TokenService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const requestService = axios.create({
  baseURL: API_BASE,
});

const token = AsyncStorage.getItem("accessToken");
requestService.interceptors.request.use(
  (config) => {
    // eslint-disable-next-line no-param-reassign
    console.log("request service token", token);
    config.headers.authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

requestService.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const valid = TokenService.getRefreshTokenValidity();
    // if refresh token is expired, redirect user to login with action
    if (!valid) {
      AsyncStorage.clear();
    }

    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      console.log("access token expired");
      return requestService({
        url: "api/auth/refresh/",
        method: "post",
        data: {
          refresh: TokenService.getRefreshToken(),
        },
      }).then((res) => {
        if (res.status === 200) {
          TokenService.setToken(res.data);

          requestService.defaults.headers.common.authorization = `Bearer ${TokenService.getAccessToken()}`;

          return requestService(originalRequest);
        }
        return null;
      });
    }
    return Promise.reject(error);
  },
);

export default requestService;
