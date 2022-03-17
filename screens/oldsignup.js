import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
// Date Time Picker
import DateTimePicker from "@react-native-community/datetimepicker";

import { setUser, setToken } from "../slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

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

//storage
import AsyncStorage from "@react-native-async-storage/async-storage";

//colors
const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;
// constants
import { status, API_BASE } from "../constants";

//icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
//formik
import { Formik, isEmptyArray } from "formik";
// keyboard avoiding view warapper
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));

  const dispatch = useDispatch();

  // user selected date
  const [dob, setDob] = useState();

  // date on change handler
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDob(currentDate);
  };
  const showDatePicker = () => {
    setShow(true);
  };

  const [message, setMessage] = useState();
  const [messageType, setMesageType] = useState(status.error);

  const handleSignup = (credentials, setSubmitting, navigation) => {
    const url = `${API_BASE}auth/register/`;
    handleMessage(null);
    axios
      .post(url, credentials)
      .then((response) => {
        if (response.status == 201) {
          const result = response.data;
          handleMessage("Signup Success", status.success);

          // add user data to redux store
          persistSignup(result, "Signup Successfully", status.success);
        } else {
          handleMessage(`Login Error: ${error.message}`, status.error);
        }
        //set activity to false
        setSubmitting(false);
      })
      .catch((error) => {
        handleMessage(`Connection Error: ${error.message}`, status.error);
        setSubmitting(false);
        console.log(error);
      });
  };

  const handleMessage = (message, type) => {
    setMessage(message);
    setMesageType(type);
  };

  // function to persist logged in user
  const persistSignup = (data, message, status, navigation) => {
    AsyncStorage.setItem("Auth", JSON.stringify(credentials))
      .then(() => {
        handleMessage(message, status);
        dispatch(setUser(data));
        dispatch(setToken(data));
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
        handleMessage("Persisting Signup Failed", status.error);
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          {/* <PageLogo resizeMode="cover" source={require("../assets/images/logo2.png")} /> */}
          <PageTitle>Pay View</PageTitle>
          <SubTitle> Create Account </SubTitle>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          <Formik
            initialValues={{ fullName: "", email: "", dateOfBirth: "", password: "", confirmPassword: "" }}
            onSubmit={(values, { setSubmitting }) => {
              // format date of birth for django backend
              first_name = values.fullName.split(" ")[0];
              last_name = values.fullName.split(" ")[1];
              values = { ...values, dateOfBirth: dob, first_name: first_name, last_name: last_name, type: "PERSONAL" };
              // validation
              if (
                values.fullName == "" ||
                values.email == "" ||
                values.dateOfBirth == "" ||
                values.password == "" ||
                values.confirmPassword == ""
              ) {
                handleMessage("Please fill all the required fields", status.error);
                setSubmitting(false);
              } else if (values.password != values.confirmPassword) {
                handleMessage("Passwords don't match", status.error);
                setSubmitting(false);
              } else {
                handleSignup(values, setSubmitting, navigation);
              }
              console.log(values);
              // navigation.navigate("Welcome");
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Full Name"
                  icon="person"
                  placeholder="Elon Musk"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  value={values.fullName}
                />
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
                  label="Date of Birth"
                  icon="calendar"
                  placeholder="YYYY - MM - DD"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("dateOfBirth")}
                  onBlur={handleBlur("dateOfBirth")}
                  value={dob ? dob.toDateString() : ""}
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
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
                <MyTextInput
                  label="Confirm Password"
                  icon="lock"
                  placeholder="* * * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Signup</ButtonText>
                  </StyledButton>
                )}
                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}
                <Line />
                <ExtraView>
                  <ExtraText>Already have an account?</ExtraText>
                  <TextLink onPress={() => navigation.navigate("Login")}>
                    <TextLinkContent>Login</TextLinkContent>
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

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      {!isDate && <StyledTextInput {...props} />}
      {isDate && (
        <TouchableOpacity onPress={showDatePicker}>
          <StyledTextInput {...props} />
        </TouchableOpacity>
      )}
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons size={30} name={hidePassword ? "md-eye-off" : "md-eye"} color={darkLight} />
        </RightIcon>
      )}
    </View>
  );
};

export default Signup;
