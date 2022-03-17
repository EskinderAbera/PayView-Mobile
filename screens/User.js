import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ImageBackground } from "react-native";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { Avatar, ListItem, Card } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Portal, Provider } from "react-native-paper";
import { useSelector } from "react-redux";
import QRCode from "react-native-qrcode-svg";
import color from "color";
import { alignItems } from "styled-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
const User = ({ navigation }) => {
  const featuresData = [];

  const specialPromoData = [];
  const [visible, setVisble] = React.useState(false);
  const [features, setFeatures] = React.useState(featuresData);
  const showModal = () => setVisble(true);
  const hideModal = () => setVisble(false);
  const [specialPromos, setSpecialPromos] = React.useState(specialPromoData);
  const user = useSelector((state) => state.auth.user);
  const access = useSelector((state) => state.auth.access);
  const user_id = user.id;

  function handleLogout() {
    console.log("logging out user");
    AsyncStorage.clear();
    navigation.navigate("SignIn");
  }

  function renderHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: SIZES.padding * 5,
          marginBottom: SIZES.padding * 2,
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
          Account Settings
        </Text>
      </TouchableOpacity>
    );
  }

  function renderBanner() {
    return (
      <View
        style={{
          height: 160,
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
            backgroundColor: COLORS.primary,
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
              alignItems: "center",
              flexDirection: "column",
              // position: "relative",
              borderRadius: 20,
              // bottom: 0,
              // left: 0,
            }}
          >
            <Avatar
              source={{
                // uri: "https://portfolio-79a9c.web.app/images/gedy_logo.jpg",
                uri: "https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?b=1&k=20&m=1300845620&s=170667a&w=0&h=JbOeyFgAc6-3jmptv6mzXpGcAd_8xqkQa_oUK2viFr8=",
              }}
              title="G.E"
              rounded={true}
              onPress={() => console.log("update profile")}
              size="large"
              activeOpacity={0.7}
            >
              <TouchableOpacity>
                <Avatar.Accessory icon size={28} />
              </TouchableOpacity>
            </Avatar>
            <View>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.white,
                  paddingLeft: 10,
                  marginTop: 4,
                  paddingTop: 4,
                }}
              >
                {user?.first_name} {user?.last_name}
              </Text>
              <TouchableOpacity onPress={showModal}>
                <Text
                  style={{
                    ...FONTS.body4,
                    color: COLORS.white,
                    marginVertical: 2,
                    paddingLeft: 10,
                    textAlign: "center",
                  }}
                >
                  Scan My Account
                </Text>
              </TouchableOpacity>
            </View>
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

    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{
          marginBottom: SIZES.padding * 2,
          width: 60,
          alignItems: "center",
        }}
        onPress={() => console.log(item.description)}
      >
        <View
          style={{
            height: 50,
            width: 50,
            marginBottom: 5,
            borderRadius: 20,
            backgroundColor: item.backgroundColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={item.icon}
            resizeMode="contain"
            style={{
              height: 20,
              width: 20,
              tintColor: item.color,
            }}
          />
        </View>
        <Text style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );

    return (
      <FlatList
        ListHeaderComponent={Header}
        data={features}
        numColumns={4}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => `${item.id}`}
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
          marginBottom: SIZES.padding,
        }}
      >
        <TouchableOpacity onPress={() => console.log("KYC")}>
          <ListItem
            style={{ backgroundColor: COLORS.lightpurple }}
            bottomDivider
          >
            <MaterialIcons
              name="verified-user"
              size={28}
              style={{ color: COLORS.primary }}
            />
            <ListItem.Content>
              <ListItem.Title>Verify KYC</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log("Banks")}>
          <ListItem
            style={{ backgroundColor: COLORS.lightGreen }}
            bottomDivider
          >
            <MaterialIcons
              name="account-balance"
              size={28}
              style={{ color: COLORS.primary }}
            />
            <ListItem.Content>
              <ListItem.Title>My Banks</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => console.log("lang")}
          style={{ backgroundColor: COLORS.lightGreen }}
        >
          <ListItem bottomDivider>
            <MaterialIcons
              name="language"
              size={28}
              style={{ color: COLORS.primary }}
            />
            <ListItem.Content>
              <ListItem.Title>Language</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => console.log("Support")} style={{ backgroundColor: COLORS.lightGreen }}>
          <ListItem bottomDivider>
            <MaterialIcons name="contact-support" size={28} style={{ color: COLORS.primary }} />
            <ListItem.Content>
              <ListItem.Title>Support</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => console.log("About")}
          style={{ backgroundColor: COLORS.lightyellow }}
        >
          <ListItem bottomDivider>
            <MaterialIcons
              name="feedback"
              size={28}
              style={{ color: COLORS.primary }}
            />
            <ListItem.Content>
              <ListItem.Title>About</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLogout()}>
          <ListItem style={{ backgroundColor: COLORS.lightRed }} bottomDivider>
            <MaterialIcons
              name="logout"
              size={28}
              style={{ color: COLORS.red }}
            />
            <ListItem.Content>
              <ListItem.Title>Logout</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </TouchableOpacity>

        {/* <View style={{ flex: 1 }}>
          <Text style={{ ...FONTS.body3 }}>Transactions</Text>
        </View>
        <TouchableOpacity onPress={() => console.log("View All")}>
          <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>View All</Text>
        </TouchableOpacity> */}
      </View>
    );

    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{
          marginVertical: SIZES.base,
          flexDirection: "row",
          flex: 1,
          borderRadius: 20,
          alignItems: "center",
        }}
        onPress={() => console.log(item.title)}
      >
        <View
          style={{
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.transparent,
          }}
        >
          <MaterialIcons
            name={item.type == "RECIVED" ? "call-received" : "call-made"}
            size={26}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 20,
              alignSelf: "center",
              // borderTopLeftRadius: 20,
              // borderTopRightRadius: 20,
              color: item.type == "RECIVED" ? COLORS.primary : COLORS.red,
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
          <Text style={{ ...FONTS.h4, flex: 1 }}>{item.title}</Text>
          <Text style={{ ...FONTS.body4 }}>{item.description}</Text>
        </View>
        <View style={{ ...FONTS.body4, padding: 10 }}>
          <Text style={{ ...FONTS.body4 }}>
            <Text
              style={{
                ...FONTS.h3,
                color: item.type == "RECIVED" ? COLORS.primary : COLORS.red,
              }}
            >
              {item.type == "RECIVED" ? "+" : "-"}
            </Text>{" "}
            {item.amount} ETB
          </Text>
          <Text style={{ ...FONTS.body5, color: COLORS.gray }}>
            {item.date}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        ListHeaderComponent={HeaderComponent}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding * 3 }}
        data={specialPromos}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ marginBottom: 80 }}></View>}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Provider>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              backgroundColor: COLORS.white,
              height: "60%",
              width: "80%",
              padding: SIZES.padding * 4,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ padding: 20 }}>
              <QRCode
                value={user_id}
                size={200}
                logo={{
                  uri: "https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?b=1&k=20&m=1300845620&s=170667a&w=0&h=JbOeyFgAc6-3jmptv6mzXpGcAd_8xqkQa_oUK2viFr8=",
                }}
                logoSize={36}
                logoBackgroundColor="transparent"
              />
            </View>
            <Text style={{ color: COLORS.black }}>
              Scan the code to receive
            </Text>
          </Modal>
        </Portal>
        {renderPromos()}
      </Provider>
    </SafeAreaView>
  );
};

export default User;
