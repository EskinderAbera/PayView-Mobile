import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Platform,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS, SIZES, FONTS, icons, images } from "../constants";

// import modal I added now
import Modal from "react-native-modal";

// Date Time Picker
import DateTimePicker from "@react-native-community/datetimepicker";

import { setUser, setToken } from "../slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Avatar, ListItem, Card } from "react-native-elements";

//storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// constants
import { status, API_BASE } from "../constants";

//icons
import { Octicons, Ionicons, Fontisto, FontAwesome } from "@expo/vector-icons";
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
// import Modal from "react-native-modal";
import { display } from "styled-system";
const ConfirmPayment = ({ route, navigation }) => {
  const [show, setShow] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const { pk } = route.params;
  const dispatch = useDispatch();

  const [message, setMessage] = useState();
  //   const [submitting, setSubmitting] = useState(false);
  const [messageType, setMesageType] = useState(status.error);
  const [receiver, setReceiver] = useState({});
  const user = useSelector((state) => state.auth.user);
  const access = useSelector((state) => state.auth.access);
  const user_id = user.id;

  const handlePayment = (credentials, setSubmitting, navigation) => {
    console.log("user detail>>", credentials);
    const url = `${API_BASE}gateway/payment/`;
    console.log("url>>", url);
    handleMessage(null);
    axios
      .post(url, credentials)
      .then((response) => {
        if (response.status == 200) {
          const result = response.data;
          console.log("Payment success>>", result);
          handleMessage("Payment Success!", status.success);
          setModalVisible(true);
          // navigation.navigate("Dashboard");
          // add user data to redux store
        } else {
          handleMessage(`Payment Error: ${error.message}`, status.error);
          setModalVisible(true);
        }
        //set activity to false
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        handleMessage(`Connection Error: ${error.message}`, status.error);
        setModalVisible(true);
        setSubmitting(false);
      });
  };
  const getUser = () => {
    const { pk } = route.params;
    console.log("user detail>>", pk);
    const url = `${API_BASE}gateway/get_user/${pk}/`;
    console.log("url>>", url);
    handleMessage(null);
    axios
      .get(url)
      .then((response) => {
        if (response.status == 200) {
          const result = response.data;
          console.log("got user detail>>", result);
          //   handleMessage("Active User Success", status.success);
          setReceiver(result);
          // add user data to redux store
        } else {
          //   handleMessage(`Invalid User Detail: ${error.message}`, status.error);
        }
        //set activity to false
        // setSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        // handleMessage(`Connection Error: ${error.message}`, status.error);
        // setSubmitting(false);
      });
  };

  React.useEffect(() => {
    getUser();
  }, []);

  const handleMessage = (message, type) => {
    setMessage(message);
    setMesageType(type);
  };

  const [showPassword, setShowPassword] = React.useState(false);

  function renderHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: SIZES.padding * 5,
          marginBottom: SIZES.padding * 2,
          marginLeft: SIZES.padding * 1,
        }}
        onPress={() => navigation.navigate("Home")}
      >
        <Image
          source={icons.back}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            tintColor: COLORS.primary,
          }}
        />

        <Text
          style={{
            marginLeft: SIZES.padding * 1.5,
            color: COLORS.primary,
            ...FONTS.h4,
          }}
        >
          Transfer
        </Text>
      </TouchableOpacity>
    );
  }
  function onModalExit() {
    setModalVisible(false);
    navigation.navigate("Dashboard");
  }
  function renderModal() {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={(navigation) => onModalExit()}
          animationIn="bounceIn"
        >
          {messageType == status.success ? (
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome
                name="check-circle"
                size={140}
                color={COLORS.primary}
              />
              <Text style={{ color: COLORS.primary, ...FONTS.body3 }}>
                {message}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome
                name="exclamation-triangle"
                size={140}
                color={COLORS.red}
              />
              <Text>{message}</Text>
            </View>
          )}
        </Modal>
      </View>
    );
  }
  function renderForm() {
    return (
      <Formik
        initialValues={{ phone: "", amount: "", description: "" }}
        onSubmit={(values, { setSubmitting }) => {
          // validation
          if (values.amount == "" || values.description == "") {
            handleMessage("Please fill all the required fields", status.error);
            console.log("values", values);
            setSubmitting(false);
          } else {
            // ['payfrom', 'payto', 'amount',
            //       'description']
            values = {
              ...values,
              payto: receiver?.phone,
              payfrom: user_id,
              // email: "test576325@gmail.com",
            };
            handlePayment(values, setSubmitting, navigation);
            console.log("values", values);
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
            {/* Phone Number */}
            <View style={{ marginTop: SIZES.padding * 4 }}>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 5,
                  padding: 5,
                }}
              >
                <Avatar
                  source={{
                    uri: "https://portfolio-79a9c.web.app/images/gedy_logo.jpg",
                  }}
                  title="G.E"
                  rounded={true}
                  onPress={() => console.log("update profile")}
                  size="large"
                  activeOpacity={0.7}
                ></Avatar>
                <Text
                  style={{
                    color: COLORS.black,
                    ...FONTS.body3,
                    textAlign: "center",
                  }}
                >
                  Payment To
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
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
                  //   placeholder="Enter Recipent's Phone Number"
                  placeholderTextColor={COLORS.white}
                  selectionColor={COLORS.white}
                  keyboardType="number-pad"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={receiver?.name}
                  editable={false}
                />
              </View>
            </View>

            <View style={{ marginTop: SIZES.padding * 2 }}>
              <Text style={{ color: COLORS.black, ...FONTS.body3 }}>
                Amount to Send
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
                placeholder="Enter Money Amount"
                placeholderTextColor={COLORS.white}
                selectionColor={COLORS.white}
                keyboardType="number-pad"
                onChangeText={handleChange("amount")}
                onBlur={handleBlur("amount")}
                value={values.amount}
              />
            </View>
            <View style={{ marginTop: SIZES.padding * 2 }}>
              <Text style={{ color: COLORS.black, ...FONTS.body3 }}>
                Reason
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
                placeholder="Please Write Short Reason"
                placeholderTextColor={COLORS.white}
                selectionColor={COLORS.white}
                keyboardType="default"
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
              />
            </View>

            <View>
              {!isSubmitting && (
                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Send</ButtonText>
                </StyledButton>
              )}
              {isSubmitting && (
                <StyledButton disabled={true}>
                  <ActivityIndicator size="large" color={COLORS.white} />
                </StyledButton>
              )}
            </View>
          </View>
        )}
      </Formik>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[COLORS.lightyellow, COLORS.emerald]}
        style={{ flex: 1 }}
      >
        <ScrollView>
          {renderHeader()}
          {/* {renderBanner()} */}
          {/* {renderLogo()} */}
          {renderForm()}
        </ScrollView>
        {renderModal()}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default ConfirmPayment;
