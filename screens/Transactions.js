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
import { COLORS, FONTS, SIZES, icons, images, API_BASE } from "../constants";
import {
  LineChart,
  BarChart,
  PieChart,
  StackedBarChart,
  ContributionGraph,
} from "react-native-chart-kit";
import axios from "axios";
import { useSelector } from "react-redux";
import { refreshToken } from "../api";
import moment from "moment";
import { ScrollView } from "react-native";

import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryPie,
} from "victory-native";

const optionsPerPage = [2, 3, 4];

const Transactions = ({ navigation }) => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  const [transactions, setTransactions] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const access = useSelector((state) => state.auth.access);
  const user_id = user.id;

  const getTransaction = () => {
    const url = `${API_BASE}gateway/transactions/${user_id}/`;
    console.log("url>>", url);
    // const api = axios.create({ headers: `Bearer ${access}` });
    axios
      .get(url)
      .then((response) => {
        if (response.status == 200) {
          const result = response.data;
          setTransactions(result);
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

  useEffect(() => {
    getTransaction();
    setPage(1);
  }, [itemsPerPage]);
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
          My Transactions
        </Text>
      </TouchableOpacity>
    );
  }
  function renderChart() {
    const data_list = [];
    const label = [];
    const latest_transaction = transactions;
    latest_transaction.map((item) => {
      data_list.push({
        day: moment(item.date).format("dddd"),
        balance:
          item.types == "payout"
            ? parseInt(-item.amount)
            : parseInt(item.amount),
      });
      // label.push(moment(item.date).format("dddd"));
      // const data_list = [
      //   { quarter: 1, earnings: 13000 },
      //   { quarter: 2, earnings: 16500 },
      //   { quarter: 3, earnings: 14250 },
      //   { quarter: 4, earnings: 19000 }
      // ];
    });
    data_list.reverse();
    label.reverse();

    console.log("data", data_list);
    // console.log("label", label);
    return (
      <View style={{ height: "40%", paddingRight: 20 }}>
        <Text>Your Balance History Chart</Text>
        <VictoryChart width={350} theme={VictoryTheme.material}>
          <VictoryLine
            style={{
              data: {
                stroke: ({ data }) =>
                  data.balance > 0 ? "#000000" : "#c43a31",
                // strokeWidth: ({ data }) => data.length,
              },
              labels: {
                fontSize: 15,
                fill: ({ datum }) =>
                  datum.balance > 0 ? "#000000" : "#c43a31",
              },
            }}
            data={data_list}
            x="day"
            y="balance"
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
          />
        </VictoryChart>
        {/* <LineChart
          data={{
            labels: label ? label : ["Data"],
            datasets: [
              {
                data: data_list ? data_list : [0],
              },
            ],
          }}
          width={Dimensions.get("window").width / 1.1} // from react-native
          height={250}
          yAxisLabel=""
          yAxisSuffix="ETB"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        /> */}
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
        <ScrollView
          style={{
            paddingBottom: 10,
            marginBottom: 5,
          }}
        >
          {transactions.map((item) => (
            <TouchableOpacity key={item.id}>
              <DataTable.Row>
                <DataTable.Cell>
                  {item.types == "payin" ? item.payfrom : item.payto}
                </DataTable.Cell>
                <DataTable.Cell>{item.types}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {item.types == "payin"
                    ? `+${item.amount}`
                    : `-${item.amount}`}{" "}
                  ETB
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {moment(item.date).format("L")}
                </DataTable.Cell>
              </DataTable.Row>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* <DataTable.Pagination
          page={page}
          numberOfPages={3}
          onPageChange={(page) => setPage(page)}
          label="1-2 of 6"
          optionsPerPage={optionsPerPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          showFastPagination
          optionsLabel={"Rows per page"}
        /> */}
      </DataTable>
    );
  }
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, padding: 20 }}
    >
      {renderHeader()}

      {page == 1 && renderChart()}
      {renderTable()}
    </SafeAreaView>
  );
};

export default Transactions;

const styles = StyleSheet.create({});
