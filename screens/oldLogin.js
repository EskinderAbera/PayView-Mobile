import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
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
} from "../components/styles";
// constants
import { status, API_BASE } from "../constants";

//colors
const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

//icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
//formik
import { Formik } from "formik";

//storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// keyboard avoiding view warapper
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
// redux
import { setUser, setToken } from "../slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMesageType] = useState(status.error);

  const dispatch = useDispatch();

  const handleLogin = (credentials, setSubmitting, navigation) => {
    console.log("user detail>>", credentials);
    const url = `${API_BASE}auth/login/`;
    console.log("url>>", url);
    handleMessage(null);
    axios
      .post(url, credentials)
      .then((response) => {
        if (response.status == 200) {
          const result = response.data;
          console.log("login success>>", result);
          handleMessage("Login Success", status.success);
          // add user data to redux store
          persistLogin(result, "User Data Persisted", status.success, navigation);
        } else {
          handleMessage(`Login Error: ${error.message}`, status.error);
        }
        //set activity to false
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        handleMessage(`Connection Error: ${error.message}`, status.error);
        setSubmitting(false);
      });
  };

  const handleMessage = (message, type) => {
    setMessage(message);
    setMesageType(type);
  };

  // function to persist logged in user
  const persistLogin = (data, message, status, navigation) => {
    AsyncStorage.setItem("Auth", JSON.stringify(data))
      .then(() => {
        handleMessage(message, status);
        dispatch(setUser(data));
        dispatch(setToken(data));
        navigation.navigate("Dashboard");
      })
      .catch((error) => {
        console.log(error);
        handleMessage("Persisting Login Failed", status.error);
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageLogo resizeMode="cover" source={require("../assets/images/logo2.png")} />
          <PageTitle>Pay View</PageTitle>
          <SubTitle> Account Login</SubTitle>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              // validation
              console.log("payload>>", values);
              if (values.email == "" || values.password == "") {
                handleMessage("Please fill all the required fields", status.error);
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting, navigation);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Email/Phone"
                  icon="mail"
                  placeholder="payview@gmail.com"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                />
                <MyTextInput
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}
                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}
                <Line />
                <StyledButton google={true} onPress={handleSubmit}>
                  <Fontisto name="google" color={primary} size={25} />
                  <ButtonText google={true}>Sign with Google</ButtonText>
                </StyledButton>
                <ExtraView>
                  <ExtraText>Don't have an account already?</ExtraText>
                  <TextLink onPress={() => navigation.navigate("Signup")}>
                    <TextLinkContent>Signup</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};
const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons size={30} name={hidePassword ? "md-eye-off" : "md-eye"} color={darkLight} />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
