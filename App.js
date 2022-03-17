import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { store } from "./store/store";
import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
// react navigation stack
import RootStack from "./navigation/RootStack";
export default function App() {
  let [fontsLoaded] = useFonts({
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    );
  }
}
