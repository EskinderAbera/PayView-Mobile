import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Scan from "../screens/Scan";
//icons
import { AntDesign, MaterialCommunityIcons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

import Svg, { Path } from "react-native-svg";
import { isIphoneX } from "react-native-iphone-x-helper";
import { Colors } from "../components/styles";
//colors
const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;
import { TabBarCustomButton, CustomTabBar } from "../components/buttons";

const Tab = createBottomTabNavigator();
const RootTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          postion: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "transparent",
          elevation: 0,
          // padding: 10,
        },
      }}
      tabBar={(props) => <CustomTabBar props={props} />}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home-filled"
              size={35}
              style={{
                // width: 25,
                // height: 25,
                color: focused ? brand : green,
              }}
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={35}
              style={{
                // width: 25,
                // height: 25,
                color: focused ? brand : green,
              }}
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name="User"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user"
              size={35}
              style={{
                // width: 25,
                // height: 25,
                color: focused ? brand : green,
              }}
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default RootTab;

const styles = StyleSheet.create({});
