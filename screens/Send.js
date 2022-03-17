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

const SignIn = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const dispatch = useDispatch();

  const [message, setMessage] = useState();
  const [messageType, setMesageType] = useState(status.error);
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
          handleMessage("Payment success", status.success);
          // navigation.navigate("Dashboard");
          // add user data to redux store
          setModalVisible(true);
        } else {
          handleMessage(`Login Error: ${error.message}`, status.error);
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

  // const [showPassword, setShowPassword] = React.useState(false);

  // const [areas, setAreas] = React.useState([]);
  // const [selectedArea, setSelectedArea] = React.useState(null);
  // const [modalVisible, setphoneModalVisible] = React.useState(false);

  // React.useEffect(() => {
  //   fetch("https://restcountries.eu/rest/v2/all")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       let areaData = data.map((item) => {
  //         return {
  //           code: item.alpha2Code,
  //           name: item.name,
  //           callingCode: `+${item.callingCodes[0]}`,
  //           flag: `https://www.countryflags.io/${item.alpha2Code}/flat/64.png`,
  //         };
  //       });

  //       setAreas(areaData);

  //       if (areaData.length > 0) {
  //         let defaultData = areaData.filter((a) => a.code == "ET");

  //         if (defaultData.length > 0) {
  //           setSelectedArea(defaultData[0]);
  //         }
  //       }
  //     });
  // }, []);

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
        onPress={() => navigation.navigate("Dashboard")}
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
          if (
            values.phone == "" ||
            values.amount == "" ||
            values.description == ""
          ) {
            handleMessage("Please fill all the required fields", status.error);
            console.log("values", values);
            setSubmitting(false);
          } else {
            const mobile = values.phone;
            if (mobile.startsWith("0")) {
              const phone_number = "+251" + mobile.substr(1);
              console.log("phone>>", phone_number);
              values = { ...values, phone: phone_number };
              // handlePayment(values, setSubmitting, navigation);
              // console.log("values", values);
            }
            // ['payfrom', 'payto', 'amount',
            //       'description']
            values = {
              ...values,
              payto: values.phone,
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
              <Text style={{ color: COLORS.black, ...FONTS.body3 }}>
                Send To
              </Text>

              <View style={{ flexDirection: "row" }}>
                {/* Country Code */}
                {/* <TouchableOpacity
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
                    <Text style={{ color: COLORS.white, ...FONTS.body3 }}>{selectedArea?.callingCode}</Text>
                  </View>
                </TouchableOpacity> */}

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
                  placeholder="Enter Recipent's Phone Number"
                  placeholderTextColor={COLORS.white}
                  selectionColor={COLORS.white}
                  keyboardType="number-pad"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
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
              <MsgBox type={messageType}>{message}</MsgBox>
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

  // function renderAreaCodesModal() {
  //   const renderItem = ({ item }) => {
  //     return (
  //       <TouchableOpacity
  //         style={{ padding: SIZES.padding, flexDirection: "row" }}
  //         onPress={() => {
  //           setSelectedArea(item);
  //           setModalVisible(false);
  //         }}
  //       >
  //         <Image
  //           source={{ uri: item.flag }}
  //           style={{
  //             width: 30,
  //             height: 30,
  //             marginRight: 10,
  //           }}
  //         />
  //         <Text style={{ ...FONTS.body4 }}>{item.name}</Text>
  //       </TouchableOpacity>
  //     );
  //   };

  //   return (
  //     <Modal animationType="slide" transparent={true} visible={modalVisible}>
  //       <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
  //         <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  //           <View
  //             style={{
  //               height: 400,
  //               width: SIZES.width * 0.8,
  //               backgroundColor: COLORS.lightGreen,
  //               borderRadius: SIZES.radius,
  //             }}
  //           >
  //             <FlatList
  //               data={areas}
  //               renderItem={renderItem}
  //               keyExtractor={(item) => item.code}
  //               showsVerticalScrollIndicator={false}
  //               style={{
  //                 padding: SIZES.padding * 2,
  //                 marginBottom: SIZES.padding * 2,
  //               }}
  //             />
  //           </View>
  //         </View>
  //       </TouchableWithoutFeedback>
  //     </Modal>
  //   );
  // }

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
      {/* {renderAreaCodesModal()} */}
    </KeyboardAvoidingView>
  );
};

export default SignIn;
