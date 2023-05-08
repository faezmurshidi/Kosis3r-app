import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Dialog, Portal, RadioButton } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

import style from '../styles';

const mockData = [
  { id: '1', type: 'deposit', amount: 100, date: '2023-05-01' },
  { id: '2', type: 'withdraw', amount: 50, date: '2023-05-02' },
  { id: '3', type: 'deposit', amount: 150, date: '2023-05-03' },
  { id: '4', type: 'deposit', amount: 200, date: '2023-05-04' },
  { id: '5', type: 'withdraw', amount: 75, date: '2023-05-05' },
];

const PaymentScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('ewallet');

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const renderItem = ({ item }) => (
    <View style={styles.transaction}>
      <Text style={styles.transactionText}>
        {item.type}: {item.amount} ({item.date})
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.balanceSection}>
        <Text style={styles.balanceText}>Current Balance: $250</Text>
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

      <Text style={styles.transactionsTitle}>Recent Transactions</Text>
      <FlatList
        data={mockData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity onPress={() => navigation.navigate('TransactionPage')}>
        <Text style={styles.viewAll}>View All</Text>
      </TouchableOpacity>

      <Text style={styles.graphTitle}>Monthly Earnings</Text>
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{ data: [50, 100, 150, 200, 250] }],
        }}
        width={300}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: style.colors.background.light.offwhite,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: style.colors.text.primary,
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  transaction: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: style.colors.background.light.lightGray,
    borderRadius: 8,
    marginBottom: 10,
  },
  transactionText: {
    color: style.colors.text.secondary,
  },
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
