import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { ImageBackground } from "react-native";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { COLORS, SIZES, FONTS, icons, images, API_BASE } from "../constants";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import { refreshToken } from "../api";
import requestService from "../api/requestService";
import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Home = ({ navigation }) => {
  const featuresData = [
    {
      id: 1,
      icon: icons.reload,
      color: COLORS.purple,
      backgroundColor: COLORS.lightpurple,
      description: "Top Up",
      handler: "Topup",
    },
    {
      id: 2,
      icon: icons.send,
      color: COLORS.yellow,
      backgroundColor: COLORS.lightyellow,
      description: "Transfer",
      handler: "Send",
    },
    {
      id: 3,
      icon: icons.request,
      color: COLORS.primary,
      backgroundColor: COLORS.lightGreen,
      description: "Request",
      handler: "Request",
    },
    {
      id: 4,
      icon: icons.wallet,
      color: COLORS.red,
      backgroundColor: COLORS.lightRed,
      description: "Wallet",
      handler: "wallet",
    },
    {
      id: 5,
      icon: icons.bill,
      color: COLORS.yellow,
      backgroundColor: COLORS.lightyellow,
      description: "Bill",
      handler: "Bill",
    },
    {
      id: 6,
      icon: icons.betting,
      color: COLORS.primary,
      backgroundColor: COLORS.lightGreen,
      description: "Betting",
      handler: "Bet",
    },
    {
      id: 7,
      icon: icons.phone,
      color: COLORS.red,
      backgroundColor: COLORS.lightRed,
      description: "Mobile Prepaid",
      handler: "Prepaid",
    },
    {
      id: 8,
      icon: icons.more,
      color: COLORS.purple,
      backgroundColor: COLORS.lightpurple,
      description: "More",
      handler: "More",
    },
  ];

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const specialPromoData = [
    {
      id: 1,
      amount: 100.0,
      img: images.promoBanner,
      title: "Eskinder Abera",
      types: "payin",
      description: "50 day Tshirt!",
      date: "20 Aug 2021",
    },
    {
      id: 2,
      amount: 45.0,
      img: images.promoBanner,
      title: "Caleb Damtew",
      description: "Avocado Juice split money",
      types: "payout",
      date: "12 Jul 2021",
    },
    {
      id: 3,
      img: images.promoBanner,
      amount: 499.0,
      title: "Ethio Tele Wifi",
      description: "Wifi Monthly Service Fee",
      types: "payout",
      date: "09 Sep 2021",
    },
    {
      id: 4,
      img: images.promoBanner,
      amount: 4750.0,
      title: "Henok Wtsenay",
      description: "Suit Money",
      types: "payout",
      date: "09 Aug 2021",
    },
  ];

  const [features, setFeatures] = React.useState(featuresData);
  const [specialPromos, setSpecialPromos] = React.useState(specialPromoData);
  const [balance, setBalance] = React.useState(0);
  const [transaction, setTransactions] = React.useState();
  const user = useSelector((state) => state.auth.user);
  const access = useSelector((state) => state.auth.access);
  const user_id = user?.id;

  const getBalance = () => {
    const url = `${API_BASE}gateway/balance_view/${user_id}/`;
    console.log("url>>", url);
    axios
      .get(url)
      .then((response) => {
        if (response.status == 200) {
          const result = response.data;
          console.log("got user balance>", result);
          setBalance(parseFloat(result.balance));
        } else if (response.status == 401) {
          // console.log("referesh token");
          refreshToken();
          getBalance();
        } else {
        }
      })
      .catch((error) => {
        if (error.status == 401) {
          console.log("referesh token");
          refreshToken();
          getBalance();
        }
        // console.log(error);
      });
  };
  const getTransaction = () => {
    const url = `${API_BASE}gateway/transactions/${user_id}/`;
    // console.log("url>>", url);
    // const api = axios.create({ headers: `Bearer ${access}` });
    axios
      .get(url)
      .then((response) => {
        if (response.status == 200) {
          const result = response.data;
          if (result.length > 6) {
            result.length = 6;
          }
          setTransactions(result);
          console.log("got user transaction>", transaction);
        } else if (response.status == 401) {
          refreshToken();
          getTransaction();
        } else {
          console.log(`Login Error: ${error.message}`, status.error);
        }
      })
      .catch((error) => {
        if (error.status == 401) {
          console.log("referesh token");
          refreshToken();
          getTransaction();
        }
        console.log(error);
      });
  };
  // const isFocused = useIsFocused();

  React.useEffect(() => {
    console.log("effect token>>", access);
    axios.interceptors.request.use(
      (config) => {
        config.headers.authorization = `Bearer ${access}`;
        return config;
      },
      (error) => {
        console.log("oops token expird=ed");
        return Promise.reject(error);
      }
    );

    getBalance();
    getTransaction();
    // const willFocusSubscription = navigation.addListener("focus", () => {
    //   getBalance();
    //   getTransaction();
    // });

    // return willFocusSubscription;
  }, []);

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: SIZES.padding * 4,
          marginBottom: SIZES.padding * 2,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ ...FONTS.body3, color: COLORS.darkgray }}>
            Hello,{" "}
          </Text>
          <Text style={{ ...FONTS.body2, color: COLORS.black }}>
            {user.first_name} {user.last_name}
          </Text>
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.lightGray,
            }}
          >
            <Image
              source={icons.bell}
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.secondary,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                height: 10,
                width: 10,
                backgroundColor: COLORS.red,
                borderRadius: 5,
              }}
            ></View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderBanner() {
    return (
      <View
        style={{
          height: 120,
          borderRadius: 20,
        }}
      >
        <ImageBackground
          source={images.cardBackground}
          resizeMode="cover"
          imageStyle={{
            borderRadius: 20,
          }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
            position: "relative",
            // top: 2,
            // left: 2,
          }}
        >
          <View
            style={{
              flex: 1,
              padding: 10,
              marginVertical: 5,
              marginLeft: 10,
              justifyContent: "center",
              // position: "relative",
              borderRadius: 20,
              // bottom: 0,
              // left: 0,
            }}
          >
            <Text
              style={{ ...FONTS.h3, color: COLORS.white, marginVertical: 2 }}
            >
              {balance} ETB{" "}
            </Text>
            <Text
              style={{ ...FONTS.body4, color: COLORS.white, marginVertical: 2 }}
            >
              Total Balance
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }

  function renderFeatures() {
    const Header = () => (
      <View style={{ marginBottom: SIZES.padding * 2 }}>
        {/* <Text style={{ ...FONTS.h3 }}>Features</Text> */}
      </View>
    );

    const renderItem = ({ item, index }) => (
      <TouchableOpacity
        style={{
          marginBottom: SIZES.padding * 2,
          width: 60,
          alignItems: "center",
        }}
        onPress={() => {
          if ((item?.handler == "Send") | (item?.handler == "Topup")) {
            navigation.navigate(item?.handler);
          } else {
            console.log(item?.handler);
          }
        }}
      >
        <View
          style={{
            height: 50,
            width: 50,
            marginBottom: 5,
            borderRadius: 20,
            backgroundColor: item?.backgroundColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={item?.icon}
            resizeMode="contain"
            style={{
              height: 20,
              width: 20,
              tintColor: item?.color,
            }}
          />
        </View>
        <Text style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}>
          {item?.description}
        </Text>
      </TouchableOpacity>
    );

    return (
      <FlatList
        ListHeaderComponent={Header}
        data={features}
        numColumns={4}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item, index) => `${item ? item.id : index}`}
        renderItem={renderItem}
        style={{ marginTop: SIZES.padding }}
      />
    );
  }

  function renderPromos() {
    const HeaderComponent = () => (
      <View>
        {renderHeader()}
        {renderBanner()}
        {renderFeatures()}
        {renderPromoHeader()}
      </View>
    );

    const renderPromoHeader = () => (
      <View
        style={{
          flexDirection: "row",
          marginBottom: SIZES.padding,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ ...FONTS.body3 }}>Transactions</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
          <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>View All</Text>
        </TouchableOpacity>
      </View>
    );

    const renderItem = ({ item, index }) => (
      <TouchableOpacity
        style={{
          marginVertical: SIZES.base,
          flexDirection: "row",
          flex: 1,
          borderRadius: 20,
          alignItems: "center",
        }}
        // onPress={() => console.log(item?.id)}
        onPress={() => navigation.navigate("TransactionDetail")}
      >
        <View
          style={{
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.transparent,
          }}
        >
          <MaterialIcons
            name={item?.types == "payin" ? "call-received" : "call-made"}
            size={26}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 20,
              alignSelf: "center",
              // borderTopLeftRadius: 20,
              // borderTopRightRadius: 20,
              color: item?.types == "payin" ? COLORS.primary : COLORS.red,
            }}
          />
        </View>

        <View
          style={{
            padding: SIZES.padding,
            backgroundColor: COLORS.lightGray,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            flex: 1,
          }}
        >
          <Text style={{ ...FONTS.h4, flex: 1 }}>
            {item?.types == "payin"
              ? item?.payfrom
              : item?.types == "topup"
              ? item?.bank
              : item?.payto}
          </Text>
          <Text style={{ ...FONTS.body4 }}>{item?.description}</Text>
        </View>
        <View style={{ ...FONTS.body4, padding: 10 }}>
          <Text style={{ ...FONTS.body4 }}>
            <Text
              style={{
                ...FONTS.h3,
                color: item?.types == "payin" ? COLORS.primary : COLORS.red,
              }}
            >
              {item?.types == "payin" ? "+" : "-"}
            </Text>{" "}
            {item?.amount} ETB
          </Text>
          <Text style={{ ...FONTS.body5, color: COLORS.gray }}>
            {moment(item?.date).format("ll")}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        ListHeaderComponent={HeaderComponent}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding * 3 }}
        data={transaction}
        keyExtractor={(item, index) => `${item ? item.id : index}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ marginBottom: 80 }}></View>}
      />
    );
  }

  // return (
  //   <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
  //     {renderPromos()}
  //   </SafeAreaView>
  // );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        ></RefreshControl> */}

      {renderPromos()}
    </SafeAreaView>
  );
};

export default Home;
