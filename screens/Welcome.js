import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// Date Time Picker
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  RightIcon,
  ButtonText,
  StyledButton,
  StyledInputLabel,
  StyledTextInput,
  Colors,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  WelcomeContainer,
  Avatar,
  WelcomeImage,
} from "../components/styles";

//colors
const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

//icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
//formik
import { Formik } from "formik";

//storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser, setToken } from "../slices/userSlice";
import { useSelector, useDispatch } from "react-redux";

const Welcome = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  // const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const clearLogin = () => {
    AsyncStorage.removeItem("Auth")
      .then(() => {
        dispatch(setToken({ access: "", refresh: "" }));
        dispatch(setUser({ user: "" }));
        navigation.navigate("Login");
      })
      .catch((error) => console.log(error));
  };
  return (
    <StyledContainer>
      <StatusBar style="light" />
      <InnerContainer>
        <WelcomeImage resizeMode="cover" source={require("./../assets/images/logo.png")} />
        <PageTitle welcome={true}>Welcome to Pay View, {user?.email}</PageTitle>
        <SubTitle welcome={true}> Your Modern Money </SubTitle>
        <WelcomeContainer>
          <StyledFormArea>
            <Avatar resizeMode="cover" source={require("./../assets/images/logo.png")} />
            <Line />
            {/* <StyledButton onPress={navigation.navigate("Login")}> */}
            <StyledButton onPress={clearLogin}>
              <ButtonText>Logout</ButtonText>
            </StyledButton>
          </StyledFormArea>
        </WelcomeContainer>
      </InnerContainer>
    </StyledContainer>
  );
};

export default Welcome;
