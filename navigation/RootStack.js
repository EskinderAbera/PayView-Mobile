import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import SignUp from "../screens/Signup";
import SignIn from "../screens/SignIn";
import ConfirmPayment from "../screens/ConfirmPayment";
import OTPVerification from "../screens/OTPVerification";
import Kyc from "../screens/Kyc";
import Send from "../screens/Send";
import Transactions from "../screens/Transactions";
import TransactionDetail from "../screens/TransactionDetail";
import Tabs from "./tabs";
import Topup from "../screens/Topup";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser, setToken, logout } from "../slices/userSlice";
import Home from "../screens/Home";
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: "transparent",
  },
};

const Stack = createNativeStackNavigator();
const RootStack = () => {
  const [appReady, setAppReady] = useState(false);
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const checkLoginCredentials = () => {
    AsyncStorage.getItem("Auth")
      .then((result) => {
        if (result !== null) {
          console.log("async user>>", result);
          dispatch(setUser({ user: JSON.parse(result) }));

          // /isTokenExpired();
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (!appReady) {
    return (
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    );
  }
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={"SignIn"}
      >
        {/* {user ? (
          <Stack.Screen
            screenOptions={{
              headerShown: false,
            }}
            name="Dashboard"
            component={Tabs}
          />
        ) : (
          <> */}
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Send" component={Send} />
        <Stack.Screen name="Kyc" component={Kyc} />
        <Stack.Screen name="Transactions" component={Transactions} />
        <Stack.Screen name="TransactionDetail" component={TransactionDetail} />
        <Stack.Screen name="Confirm" component={ConfirmPayment} />
        <Stack.Screen name="Topup" component={Topup} />
        <Stack.Screen
          screenOptions={{
            headerShown: false,
          }}
          name="Otp"
          component={OTPVerification}
        />

        <Stack.Screen
          screenOptions={{
            headerShown: false,
          }}
          name="Dashboard"
          component={Tabs}
        />
        {/* </>
        )} */}

        {/* <Stack.Screen name="Scan" component={Scan} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
