import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { RNCamera } from "react-native-camera";
import { Camera } from "expo-camera";
import { COLORS, FONTS, SIZES, icons, images } from "../constants";

const Scan = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      // const { status } = await Camera.requestPermissionsAsync();
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    console.log("camera permission granted");
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: SIZES.padding * 4,
          paddingHorizontal: SIZES.padding * 3,
        }}
      >
        <TouchableOpacity
          style={{
            width: 45,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={icons.close}
            style={{
              height: 20,
              width: 20,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
            Scan for Payment
          </Text>
        </View>

        <TouchableOpacity
          style={{
            height: 45,
            width: 45,
            backgroundColor: COLORS.green,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => console.log("Info")}
        >
          <Image
            source={icons.info}
            style={{
              height: 25,
              width: 25,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderScanFocus() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={images.focus}
          resizeMode="stretch"
          style={{
            marginTop: "-55%",
            width: 200,
            height: 300,
          }}
        />
      </View>
    );
  }

  function renderPaymentMethods() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 220,
          padding: SIZES.padding * 3,
          borderTopLeftRadius: SIZES.radius,
          borderTopRightRadius: SIZES.radius,
          backgroundColor: COLORS.white,
        }}
      >
        <Text style={{ ...FONTS.h4 }}>payment methods</Text>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: SIZES.padding * 2,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => console.log("Phone Number")}
          >
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: COLORS.lightpurple,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Image
                source={icons.phone}
                resizeMode="cover"
                style={{
                  height: 25,
                  width: 25,
                  tintColor: COLORS.purple,
                }}
              />
            </View>
            <Text style={{ marginLeft: SIZES.padding, ...FONTS.body4 }}>
              Phone Number
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: SIZES.padding * 2,
            }}
            onPress={() => console.log("Barcode")}
          >
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: COLORS.lightGreen,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Image
                source={icons.barcode}
                resizeMode="cover"
                style={{
                  height: 25,
                  width: 25,
                  tintColor: COLORS.primary,
                }}
              />
            </View>
            <Text style={{ marginLeft: SIZES.padding, ...FONTS.body4 }}>
              Barcode
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function onBarCodeRead(result) {
    console.log(result.data);
    navigation.navigate("Confirm", { pk: result.data });
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.transparent }}>
      {/* <RNCamera
        ref={(ref) => {
          this.camera = ref;
        }}
        style={{ flex: 1 }}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        onBarCodeRead={onBarCodeRead}
        androidCameraPermissionOptions={{
          title: "Permission to use camera",
          message: "Camera is required for barcode scanning",
          buttonPositive: "OK",
          buttonNegative: "Cancel",
        }}
      > */}
      <Camera
        style={{ flex: 1 }}
        type={type}
        flashMode={Camera.Constants.FlashMode.off}
        onBarCodeScanned={onBarCodeRead}
      >
        {/* <View style={styles.buttonContainer}> */}
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
          }}
        >
          <Text style={styles.text}> Flip </Text>
        </TouchableOpacity> */}
        {renderHeader()}
        {renderScanFocus()}
        {renderPaymentMethods()}
        {/* </View> */}
      </Camera>
      {/* </RNCamera> */}
    </View>
  );
};

export default Scan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
