import React, { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
// screens
import Login from "../screens/oldLogin";
import Signup from "../screens/SignUp";
import Welcome from "../screens/Welcome";
//colors
import { Colors } from "../components/styles";
const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

import { setUser, setToken, logout } from "../slices/userSlice";
import { useSelector, useDispatch } from "react-redux";

import RootTab from "./RootTab";

const Stack = createNativeStackNavigator();

const RootStack = () => {
  const user = useSelector((state) => state?.auth?.user);
  const token = useSelector((state) => state?.auth?.token);

  const [tokenExpired, setTokenExpired] = useState(false);

  const isTokenExpired = async () => {
    try {
      access_token = token.access || "";
      if (access_token) {
        const { exp } = JwtDecode(access_token);
        if (exp < (new Date().getTime() + 1) / 1000) {
          setTokenExpired(true);
        } else {
          //Navigate inside the application
          setTokenExpired(false);
        }
      } else {
        //Navigate to the login page
      }
    } catch (err) {
      console.log("Spalsh -> isTokenExpired -> err", err);
      //Navigate to the login page
      return false;
    }
  };
  const [appReady, setAppReady] = useState(false);
  const dispatch = useDispatch();
  const checkLoginCredentials = () => {
    AsyncStorage.getAllKeys()
      .then((result) => {
        if (result !== null) {
          dispatch(setUser(JSON.parse(result.Auth)));
          dispatch(setToken(JSON.parse(result.access)));
          isTokenExpired();
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (!appReady) {
    return <AppLoading startAsync={checkLoginCredentials} onFinish={() => setAppReady(true)} onError={console.warn} />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTintColor: tertiary,
          headerTransparent: true,
          headerTitle: "",
          headerLeftContainer: {
            paddingLeft: 20,
          },
        }}
        initialRouteName="Login"
      >
        {/* all screens receive a navigator props object to navigate between each other */}
        {/* check if there is any user logged in */}
        {tokenExpired ? (
          <Stack.Screen
            options={{
              headerTintColor: primary,
            }}
            name="Welcome"
            component={Welcome}
          />
        ) : (
          <>
            <Stack.Screen
              name="Signup"
              options={{
                headerShown: false,
              }}
              component={Signup}
            />
            <Stack.Screen
              options={{
                headerTintColor: primary,
                headerShown: false,
              }}
              name="Welcome"
              component={Welcome}
            />
            <Stack.Screen
              name="Login"
              options={{
                headerShown: false,
              }}
              component={Login}
            />
            {/* Tabs */}
            <Stack.Screen
              name="Dashboard"
              component={RootTab}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;

const styles = StyleSheet.create({});
