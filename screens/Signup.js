import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS, SIZES, FONTS, icons, images } from "../constants";

// Date Time Picker
import DateTimePicker from "@react-native-community/datetimepicker";

import { setUser, setToken } from "../slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

//storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// constants
import { status, API_BASE } from "../constants";

//icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import {
  Line,
  StyledContainer,
  ButtonText,
  MsgBox,
  StyledButton,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
} from "../components/styles";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";

const SignUp = ({ navigation }) => {
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
    const url = `${API_BASE}api/auth/register/`;
    handleMessage(null);
    axios
      .post(url, credentials)
      .then((response) => {
        if (response.status == 201) {
          const result = response.data;
          handleMessage("Signup Success", status.success);

          // add user data to redux store
          persistSignup(
            result,
            "Signup Successfully",
            status.success,
            navigation
          );
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
    // AsyncStorage.setItem("accessToken", data.access);
    // AsyncStorage.setItem("refreshToken", data.refresh);
    AsyncStorage.setItem("Auth", JSON.stringify(data.user))
      .then(() => {
        handleMessage(message, status);
        dispatch(setUser(data));
        dispatch(setToken(data));
        navigation.navigate("Otp");
      })
      .catch((error) => {
        console.log(error);
        handleMessage("Persisting Signup Failed", status.error);
      });
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const [areas, setAreas] = React.useState([]);
  const [selectedArea, setSelectedArea] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then((response) => response.json())
      .then((data) => {
        let areaData = data.map((item) => {
          return {
            code: item.alpha2Code,
            name: item.name,
            callingCode: `+${item.callingCodes[0]}`,
            flag: `https://countryflagsapi.com/png/${item.name}`,
          };
        });

        setAreas(areaData);

        if (areaData.length > 0) {
          let defaultData = areaData.filter((a) => a.code == "ET");

          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
          }
        }
      });
  }, []);

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: SIZES.padding * 6,
          paddingHorizontal: SIZES.padding * 2,
        }}
        // onPress={() => console.log("Sign Up")}
      ></View>
    );
  }

  function renderLogo() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 5,
          height: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={images.payviewLogo}
          resizeMode="contain"
          style={{
            width: "70%",
          }}
        />
      </View>
    );
  }

  function renderForm() {
    return (
      <Formik
        initialValues={{ fullName: "", phone: "", password: "" }}
        onSubmit={(values, { setSubmitting }) => {
          // validation
          if (
            values.fullName == "" ||
            values.phone == "" ||
            values.password == ""
          ) {
            handleMessage("Please fill all the required fields", status.error);
            setSubmitting(false);
          } else {
            const first_name = values.fullName.split(" ")[0];
            const last_name = values.fullName.split(" ")[1];
            if (values.phone == "" || values.password == "") {
              handleMessage(
                "Please fill all the required fields",
                status.error
              );
              setSubmitting(false);
            } else {
              const mobile = values.phone;
              if (mobile.startsWith("0")) {
                const phone_number =
                  selectedArea.callingCode + mobile.substr(1);
                console.log("phone>>", phone_number);
                values = { ...values, phone: phone_number };
                // handleSignIn(values, setSubmitting, navigation);
                // console.log("values", values);
              }
              values = {
                ...values,
                first_name: first_name,
                last_name: last_name,
                type: "PERSONAL",
                username: values.phone,
                email: "",
              };
              handleSignup(values, setSubmitting, navigation);
              console.log("values", values);
            }
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
          <View
            style={{
              marginTop: SIZES.padding * 3,
              marginHorizontal: SIZES.padding * 3,
            }}
          >
            {/* Full Name */}
            <View style={{ marginTop: SIZES.padding * 3 }}>
              <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
                Full Name
              </Text>
              <TextInput
                style={{
                  marginVertical: SIZES.padding,
                  borderBottomColor: COLORS.white,
                  borderBottomWidth: 1,
                  height: 40,
                  color: COLORS.white,
                  ...FONTS.body3,
                }}
                placeholder="Enter Full Name"
                placeholderTextColor={COLORS.white}
                selectionColor={COLORS.white}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                value={values.fullName}
              />
            </View>

            {/* Phone Number */}
            <View style={{ marginTop: SIZES.padding * 2 }}>
              <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
                Phone Number
              </Text>

              <View style={{ flexDirection: "row" }}>
                {/* Country Code */}
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 50,
                    marginHorizontal: 5,
                    borderBottomColor: COLORS.white,
                    borderBottomWidth: 1,
                    flexDirection: "row",
                    ...FONTS.body2,
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      source={icons.down}
                      style={{
                        width: 10,
                        height: 10,
                        tintColor: COLORS.white,
                      }}
                    />
                  </View>
                  <View style={{ justifyContent: "center", marginLeft: 5 }}>
                    <Image
                      source={{ uri: selectedArea?.flag }}
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    />
                  </View>

                  <View style={{ justifyContent: "center", marginLeft: 5 }}>
                    <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                      {selectedArea?.callingCode}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Phone Number */}
                <TextInput
                  style={{
                    flex: 1,
                    marginVertical: SIZES.padding,
                    borderBottomColor: COLORS.white,
                    borderBottomWidth: 1,
                    height: 40,
                    color: COLORS.white,
                    ...FONTS.body3,
                  }}
                  placeholder="Enter Phone Number"
                  placeholderTextColor={COLORS.white}
                  selectionColor={COLORS.white}
                  keyboardType="number-pad"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                />
              </View>
            </View>

            {/* Password */}
            <View style={{ marginTop: SIZES.padding * 2 }}>
              <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
                Password
              </Text>
              <TextInput
                style={{
                  marginVertical: SIZES.padding,
                  borderBottomColor: COLORS.white,
                  borderBottomWidth: 1,
                  height: 40,
                  color: COLORS.white,
                  ...FONTS.body3,
                }}
                placeholder="Enter Password"
                placeholderTextColor={COLORS.white}
                selectionColor={COLORS.white}
                secureTextEntry={!showPassword}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 10,
                  height: 30,
                  width: 30,
                }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={showPassword ? icons.disable_eye : icons.eye}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.white,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View>
              <MsgBox type={messageType}>{message}</MsgBox>
              {!isSubmitting && (
                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Signup</ButtonText>
                </StyledButton>
              )}
              {isSubmitting && (
                <StyledButton disabled={true}>
                  <ActivityIndicator size="large" color={COLORS.white} />
                </StyledButton>
              )}
              <Line />
              <ExtraView>
                <ExtraText>Already have an account? </ExtraText>
                <TextLink onPress={() => navigation.navigate("SignIn")}>
                  <TextLinkContent>SignIn</TextLinkContent>
                </TextLink>
              </ExtraView>
            </View>
          </View>
        )}
      </Formik>
    );
  }

  function renderAreaCodesModal() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{ padding: SIZES.padding, flexDirection: "row" }}
          onPress={() => {
            setSelectedArea(item);
            setModalVisible(false);
          }}
        >
          <Image
            source={{ uri: item.flag }}
            style={{
              width: 30,
              height: 30,
              marginRight: 10,
            }}
          />
          <Text style={{ ...FONTS.body4 }}>{item.name}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                height: 400,
                width: SIZES.width * 0.8,
                backgroundColor: COLORS.lightGreen,
                borderRadius: SIZES.radius,
              }}
            >
              <FlatList
                data={areas}
                renderItem={renderItem}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
                style={{
                  padding: SIZES.padding * 2,
                  marginBottom: SIZES.padding * 2,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary]}
        style={{ flex: 1 }}
      >
        <ScrollView>
          {renderHeader()}
          {renderLogo()}
          {renderForm()}
        </ScrollView>
      </LinearGradient>
      {renderAreaCodesModal()}
    </KeyboardAvoidingView>
  );
};

export default SignUp;
