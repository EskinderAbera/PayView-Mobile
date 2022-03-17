import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
const TokenService = (function tokenService() {
  let service;
  function getServiceFunc() {
    if (!service) {
      service = this;
      return service;
    }
    return service;
  }

  const setToken = (tokenObj) => {
    if (tokenObj.access) {
      AsyncStorage.setItem("accessToken", tokenObj.access);
    }
    if (tokenObj.refresh) {
      AsyncStorage.setItem("refreshToken", tokenObj.refresh);
    }
  };

  const getAccessToken = async () => {
    const access = await AsyncStorage.getItem("accessToken");
    console.log("async access", access);
    return access;
  };

  const getRefreshToken = async () => {
    const refresh = await AsyncStorage.getItem("refreshToken");
    return refresh;
  };

  const getTokenValidity = (tokenObj) => {
    const decodedToken = jwt_decode(tokenObj, { complete: true });
    const dateNow = new Date();
    const timeStamp = dateNow.getTime() / 1000;

    if (decodedToken.payload.exp < timeStamp) {
      return false;
    }
    return true;
  };

  const getAccessTokenValidity = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return getTokenValidity(accessToken);
    }
    return null;
  };

  const getRefreshTokenValidity = () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      return getTokenValidity(refreshToken);
    }
    return null;
  };

  const clearToken = () => {
    AsyncStorage.removeItem("accessToken");
    AsyncStorage.removeItem("refreshToken");
  };

  return {
    getService: getServiceFunc,
    setToken,
    getAccessToken,
    getRefreshToken,
    getAccessTokenValidity,
    getRefreshTokenValidity,
    clearToken,
  };
})();

export default TokenService;
