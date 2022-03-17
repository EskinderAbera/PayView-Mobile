import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native";
import { ImageBackground } from "react-native";
import { SafeAreaView, View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import AnimatedExample from "../components/AnimatedOtp";
import { ScrollView } from "react-native";
const OTPVerification = ({ navigation }) => {
  const [otpCode, setOtpCode] = React.useState("");

  const getOtp = (otp) => {
    setOtpCode(otp);
  };

  function renderHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: SIZES.padding * 5,
          padding: 20,
        }}
        onPress={() => navigation.navigate("SignIn")}
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

        <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.primary, ...FONTS.h4 }}>OTP Verification</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
        <ScrollView>
          {renderHeader()}
          <AnimatedExample navigation={navigation} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPVerification;
