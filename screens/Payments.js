import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import { Dialog, Portal, RadioButton } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import PagerView from 'react-native-pager-view';
import { TabView, SceneMap } from 'react-native-tab-view';

import style from '../styles';

const screenWidth = Dimensions.get('window').width;

const mockData = [
  {
    id: '1',
    type: 'Paper',
    status: 'pending',
    amount: 100,
    weight: 10,
    rate: 0.15,
    date: '2023-05-01',
  },
  {
    id: '2',
    type: 'Can',
    status: 'pending',
    amount: 50,
    weight: 10,
    rate: 0.15,
    date: '2023-05-02',
  },
  {
    id: '3',
    type: 'UCO',
    status: 'pending',
    amount: 150,
    weight: 10,
    rate: 0.15,
    date: '2023-05-03',
  },
  {
    id: '4',
    type: 'deposit',
    status: 'pending',
    amount: 200,
    weight: 10,
    rate: 0.15,
    date: '2023-05-04',
  },
  {
    id: '5',
    type: 'withdraw',
    status: 'pending',
    amount: 75,
    weight: 10,
    rate: 0.15,
    date: '2023-05-05',
  },
];

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const PaymentScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('ewallet');

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  const renderItem = ({ item }) => {
    const date = moment(Date.now()).format('DD MMMM YYYY');
    return (
      <View style={styles.transaction}>
        <View style={styles.transactionInfoContainer}>
          <Text>{date}</Text>
          <Text>
            {item.weight}g of {item.type} @ {item.rate}/Kg
          </Text>
          <Text>RM{item.amount}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.indicator(item.status)} />
          <Text style={styles.transactionStatus}>{item.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.balanceSection}>
        <Text style={styles.balanceText}>Baki Terkumpul: RM250</Text>
        <Button
          title="Withdraw Balance"
          onPress={showDialog}
          color={style.colors.primary}
        />
      </View>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Choose Withdraw Method</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => setWithdrawMethod(value)}
              value={withdrawMethod}
            >
              <View style={styles.radioButton}>
                <Text>eWallet</Text>
                <RadioButton value="ewallet" />
              </View>
              <View style={styles.radioButton}>
                <Text>Voucher Redemption</Text>
                <RadioButton value="voucher" />
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={hideDialog}
              title="Cancel"
              color={style.colors.secondary}
            />
            <Button
              onPress={hideDialog}
              title="Confirm"
              color={style.colors.primary}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />

      {/* <PagerView
        style={styles.pagerView}
        orientation={'horizontal'}
        initialPage={1}
      >
        <View key="1">
          <Text style={styles.transactionsTitle}>Transaksi Terkini</Text>
          <FlatList
            style={styles.transactionsList}
            data={mockData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('TransactionPage')}
          >
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View key="2">
          <Text style={styles.graphTitle}>Monthly Earnings</Text>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
              datasets: [{ data: [50, 100, 150, 200, 250] }],
            }}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: style.colors.background.light.offwhite,
              backgroundGradientFrom: style.colors.background.light.offwhite,
              backgroundGradientTo: style.colors.background.light.offwhite,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            bezier
          />
        </View>
      </PagerView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: style.colors.background.light.offwhite,
  },
  pagerView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: style.colors.text.primary,
  },
  balanceSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  balanceText: {
    fontSize: 18,
    color: style.colors.text.primary,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: style.colors.text.primary,
  },
  transactionsList: {
    width: '100%',
    paddingHorizontal: 20,
  },
  transaction: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: style.colors.background.light.lightGray,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  transactionInfoContainer: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionStatus: {
    marginLeft: 5,
  },
  indicator: (status) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor:
      status === 'pending'
        ? 'yellow'
        : status === 'cancelled'
        ? 'red'
        : 'green',
  }),
  viewAll: {
    fontSize: 16,
    color: style.colors.primary,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: style.colors.text.primary,
  },
});

export default PaymentScreen;
