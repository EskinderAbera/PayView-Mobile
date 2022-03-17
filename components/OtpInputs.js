import React from "react";
import { StyleSheet } from "react-native";
import { Content, Item, Input } from "native-base";
import { Grid, Col } from "react-native-easy-grid";

const OtpInputs = () => {
  const [otp, setOtp] = React.useState([]);
  //   const [otpTextInput, setOtpTextInput] = React.useState([]);
  var otpTextInput = [];

  React.useEffect(() => {
    otpTextInput[0]._root.focus();
  }, []);

  function renderInputs() {
    const inputs = Array(6).fill(0);
    return (
      <>
        {inputs.map((i, j) => (
          <Col key={j} style={styles.txtMargin}>
            <Item regular>
              <Input
                style={[styles.inputRadius, { borderRadius: 10 }]}
                keyboardType="numeric"
                onChangeText={(v) => focusNext(j, v)}
                onKeyPress={(e) => focusPrevious(e.nativeEvent.key, j)}
                ref={(ref) => (otpTextInput[j] = ref)}
              />
            </Item>
          </Col>
        ))}
      </>
    );
  }

  function focusPrevious(key, index) {
    if (key === "Backspace" && index !== 0) otpTextInput[index - 1]._root.focus();
  }

  function focusNext(index, value) {
    if (index < otpTextInput.length - 1 && value) {
      otpTextInput[index + 1]._root.focus();
    }
    if (index === otpTextInput.length - 1) {
      otpTextInput[index]._root.blur();
    }
    const otp = otp;
    otp[index] = value;
    setOtp({ otp });
    props.getOtp(otp.join(""));
  }

  return (
    <Content padder>
      <Grid style={styles.gridPad}>{renderInputs()}</Grid>
    </Content>
  );
};
export default OtpInputs;

const styles = StyleSheet.create({
  gridPad: { padding: 30 },
  txtMargin: { margin: 3 },
  inputRadius: { textAlign: "center" },
});
