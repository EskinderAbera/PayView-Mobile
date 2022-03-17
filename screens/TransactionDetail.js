import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native";
import { DataTable } from "react-native-paper";
import { COLORS, FONTS, SIZES, icons, images } from "../constants";
import {
  LineChart,
  BarChart,
  PieChart,
  StackedBarChart,
  ContributionGraph,
} from "react-native-chart-kit";
import axios from "axios";
import { useSelector } from "react-redux";
const optionsPerPage = [2, 3, 4];

const TransactionDetail = ({ navigation }) => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const getTransactionData = () => {
    const url = `${API_BASE}gateway/transaction/`;
    handleMessage(null);
    axios
      .post(url, credentials)
      .then((response) => {
        if (response.status == 201) {
          const result = response.data;
          setTransaction(result);
          handleMessage("Signup Success", status.success);

          // add user data to redux store
          persistSignup(
            result,
            "Signup Successfully",
            status.success,
            navigation
          );
        } else {
          handleMessage(`Login Error: ${error.message}`, status.error);
        }
        //set activity to false
        setSubmitting(false);
      })
      .catch((error) => {
        handleMessage(`Connection Error: ${error.message}`, status.error);
        setSubmitting(false);
        console.log(error);
      });
  };

  const handleMessage = (message, type) => {
    setMessage(message);
    setMesageType(type);
  };

  function renderHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: SIZES.padding * 5,
          marginBottom: SIZES.padding * 2,
        }}
        onPress={() => navigation.navigate("Dashboard")}
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
          My Transactions
        </Text>
      </TouchableOpacity>
    );
  }
  function renderChart() {
    return (
      <View style={{ height: "40%", paddingRight: 20 }}>
        <Text>Your Balance History Chart</Text>
        <LineChart
          data={{
            labels: ["January", "February", "March", "April", "May"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
              },
            ],
          }}
          width={Dimensions.get("window").width - 35} // from react-native
          height={220}
          yAxisLabel={" ETB "}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
              padding: 10,
              margin: 10,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 5,
            // margin: 10,
            // padding: 10,
          }}
        />
      </View>
    );
  }
  function renderTable() {
    return (
      <DataTable style={{ height: "50%", marginTop: 10 }}>
        <DataTable.Header>
          <DataTable.Title>To/From</DataTable.Title>
          <DataTable.Title>Type</DataTable.Title>
          <DataTable.Title numeric>Amount</DataTable.Title>
          <DataTable.Title numeric>Date</DataTable.Title>
        </DataTable.Header>
        {/* run for lipp here */}
        <TouchableOpacity>
          <DataTable.Row>
            <DataTable.Cell>Eskinder</DataTable.Cell>
            <DataTable.Cell>Payed</DataTable.Cell>
            <DataTable.Cell numeric>250 ETB</DataTable.Cell>
            <DataTable.Cell numeric>20 Aug 2021</DataTable.Cell>
          </DataTable.Row>
        </TouchableOpacity>
      </DataTable>
    );
  }
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, padding: 20 }}
    >
      {renderHeader()}
      {renderChart()}
      {renderTable()}
    </SafeAreaView>
  );
};

export default TransactionDetail;

const styles = StyleSheet.create({});
