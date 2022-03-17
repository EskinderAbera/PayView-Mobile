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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS, SIZES, FONTS, icons, images } from "../constants";

// Date Time Picker
import DateTimePicker from "@react-native-community/datetimepicker";

import { setUser, setToken } from "../slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { Picker } from "@react-native-community/picker";
import axios from "axios";

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
import Modal from "react-native-modal";

const Topup = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const dispatch = useDispatch();

  const [message, setMessage] = useState();
  const [messageType, setMesageType] = useState(status.error);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState();
  const user = useSelector((state) => state.auth.user);
  const access = useSelector((state) => state.auth.access);
  const user_id = user.id;

  const handleTopup = (credentials, setSubmitting, navigation) => {
    console.log("user detail>>", credentials);
    const url = `${API_BASE}gateway/topup/${user_id}/`;
    console.log("url>>", url);
    handleMessage(null);
    axios
      .post(url, credentials)
      .then((response) => {
        if (response.status == 201) {
          const result = response.data;
          console.log("Topup success>>", result);
          handleMessage("Topup success", status.success);
          setModalVisible(true);
          // add user data to redux store
        } else {
          handleMessage(`Login Error`, status.error);
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

  const handleMessage = (message, type) => {
    setMessage(message);
    setMesageType(type);
  };

  React.useEffect(() => {
    axios.get(`${API_BASE}gateway/banks/`).then((response) => {
      data = response.data;
      setBanks(data);
      // console.log("Bank List>>", banks);
    });
  }, []);

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
            tintColor: COLORS.white,
          }}
        />

        <Text
          style={{
            marginLeft: SIZES.padding * 1.5,
            color: COLORS.white,
            ...FONTS.h4,
          }}
        >
          Topup
        </Text>
      </TouchableOpacity>
    );
  }

  function renderForm() {
    return (
      <Formik
        initialValues={{ bank: "", account_number: "", amount: "" }}
        onSubmit={(values, { setSubmitting }) => {
          // validation
          values = {
            ...values,
            bank: selectedBank,
          };
          if (
            values.bank == "" ||
            values.account_number == "" ||
            values.amount == ""
          ) {
            handleMessage("Please fill all the required fields", status.error);
            // console.log("values", values);
            setSubmitting(false);
          } else {
            values = {
              ...values,
              user: user_id,
              bank: values.bank.toString(),
            };
            handleTopup(values, setSubmitting, navigation);
            // console.log("values", values);
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
            <View style={{ marginTop: SIZES.padding * 4 }}>
              <Text style={{ color: COLORS.black, ...FONTS.body3 }}>
                Select your Bank
              </Text>

              <View style={{ flexDirection: "row" }}>
                <Picker
                  selectedValue={selectedBank}
                  style={{
                    flex: 1,
                    marginVertical: SIZES.padding,
                    borderBottomColor: COLORS.white,
                    borderBottomWidth: 1,
                    height: 40,
                    color: COLORS.white,
                    ...FONTS.body3,
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedBank(itemValue)
                  }
                >
                  <Picker.Item label="Choose Your Bank" value="" />
                  {banks?.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.bankname}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={{ marginTop: SIZES.padding * 2 }}>
              <Text style={{ color: COLORS.black, ...FONTS.body3 }}>
                Account Number
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
                placeholder="Type your Bank Account Number"
                placeholderTextColor={COLORS.white}
                selectionColor={COLORS.white}
                keyboardType="default"
                onChangeText={handleChange("account_number")}
                onBlur={handleBlur("account_number")}
                value={values.account_number}
              />
            </View>
            <View style={{ marginTop: SIZES.padding * 2 }}>
              <Text style={{ color: COLORS.black, ...FONTS.body3 }}>
                Amount to Deposit
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

            <View>
              <MsgBox type={messageType}>{message}</MsgBox>
              {!isSubmitting && (
                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Topup</ButtonText>
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
        colors={[COLORS.primary, COLORS.primary]}
        style={{ flex: 1 }}
      >
        <ScrollView>
          {renderHeader()}
          {/* {renderLogo()} */}
          {renderForm()}
        </ScrollView>
        {renderModal()}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Topup;
