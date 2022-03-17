import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../components/styles";
//colors
const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;
import { AntDesign, MaterialCommunityIcons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

import Svg, { Path } from "react-native-svg";
import { isIphoneX } from "react-native-iphone-x-helper";
import { TouchableOpacity } from "react-native";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

export const TabBarCustomButton = ({ accessibilityLabel, accessibilityState, children, onPress }) => {
  var isSelected = accessibilityState.selected;

  if (isSelected) {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            top: 0,
          }}
        >
          <View style={{ flex: 1, backgroundColor: primary }}></View>
          <Svg width={75} height={61} viewBox="0 0 75 61">
            <Path
              d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
              fill={primary}
            />
          </Svg>
          <View style={{ flex: 1, backgroundColor: primary }}></View>
        </View>

        <TouchableOpacity
          style={{
            top: -22.5,
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: secondary,
            ...styles.shadow,
          }}
          onPress={onPress}
        >
          {children}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: 50,
          height: 50,
          backgroundColor: primary,
        }}
        activeOpacity={1}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    );
  }
};

export const CustomTabBar = (props) => {
  if (isIphoneX()) {
    return (
      <View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 30,
            backgroundColor: COLORS.white,
          }}
        ></View>
        <BottomTabBar {...props.props} />
      </View>
    );
  } else {
    return <BottomTabBar {...props.props} />;
  }
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: primary,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
