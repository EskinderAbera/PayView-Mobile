import Axios from "axios";
import { API_BASE } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

// const access = JSON.parse(AsyncStorage.getItem("Auth")).access;

export const axios = Axios.create({
  baseURL: API_BASE,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${AsyncStorage.getItem("access", "")}`,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export const refreshToken = () => {
  const refresh = AsyncStorage.getItem("refresh");
  return new Promise((resolve, reject) => {
    axios
      .post(`api/auth/refresh/`, { refresh: refresh })
      .then(async (response) => {
        console.log("updating token", response);
        AsyncStorage.setItem("refresh", response.data.refresh);
        AsyncStorage.setItem("access", response.data.access);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
