/*

Concept: https://dribbble.com/shots/5476562-Forgot-Password-Verification/attachments

*/
import { Animated, Image, SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import axios from "axios";

import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from "./styles";

const { Value, Text: AnimatedText } = Animated;
import { useSelector } from "react-redux";
import { API_BASE } from "../../constants";

const CELL_COUNT = 5;
const source = {
  uri: "https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png",
};

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({ hasValue, index, isFocused }) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const AnimatedExample = ({ navigation }) => {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const user = useSelector((state) => state.auth.user);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleVerification = () => {
    const url = `${API_BASE}api/validate/`;
    console.log("url>>", url);
    const payload = { phone: user.phone, number: value };
    console.log("payload>>", payload);
    axios
      .post(url, payload)
      .then((response) => {
        if (response.status == 200) {
          const result = response.data;
          console.log("verfication success>>", result);
          navigation.navigate("SignIn");
          //   handleMessage("Login Success", status.success);
          //   // add user data to redux store
          //   persistLogin(result, "User Data Persisted", status.success, navigation);
        } else {
          console.log(`Login Error: ${error.message}`, status.error);
        }
        //set activity to false
        // setSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        console.log(`Connection Error: ${error.message}`, status.error);
        // setSubmitting(false);
      });
  };

  const renderCell = ({ index, symbol, isFocused }) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText key={index} style={[styles.cell, animatedCellStyle]} onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Verification</Text>
      <Image style={styles.icon} source={source} />
      <Text style={styles.subTitle}>
        Please enter the verification code{"\n"}
        we sent to your mobile phone
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFiledRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
          >
            <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
          </View>
        )}
      />
      {/* <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFiledRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      /> */}
      <TouchableOpacity style={styles.nextButton} onPress={handleVerification}>
        <Text style={styles.nextButtonText}>Verify</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AnimatedExample;
