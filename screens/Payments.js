/* eslint-disable react/no-unstable-nested-components */
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import {
  Dialog,
  Divider,
  Portal,
  RadioButton,
  Text,
  TextInput,
} from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import moment from 'moment';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import i18n from '../i18n';
import Modal from 'react-native-modal';

import style from '../styles';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import {
  createWithdrawalRequest,
  fetchUserFromFirestore,
  getTransactions,
  getWithdrawals,
} from '../firebase/firebaseUtils';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

const screenWidth = Dimensions.get('window').width;

const PaymentScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('ewallet');
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [txHistory, setTxHistory] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);

  // ref
  const bottomSheetModalRef = useRef(null);
  const redeemVoucherRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['50%'], []);
  const snapPointsVoucher = useMemo(() => ['50%', '50%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleVoucherModalPress = useCallback(() => {
    redeemVoucherRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const category = i18n.t('recycleCategories', { returnObjects: true });

  const fetchTransactions = async () => {
    setRefreshing(true);
    try {
      const transactions = await getTransactions(user?.uid);
      console.log('transactions@Payments', transactions);
      // Do something with the transactions
      if (transactions) {
        setTxHistory(transactions);
      }
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchWihdrawal = async () => {
    setRefreshing(true);
    try {
      const transactions = await getWithdrawals(user?.uid);
      console.log('transactions@Payments', transactions);
      // Do something with the transactions
      if (transactions) {
        setWithdrawalHistory(transactions);
      }
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchWihdrawal();
  }, []);

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setWithdrawAmount(0);
    setWithdrawError(null);
    setVisible(false);
  };

  const layout = useWindowDimensions();

  console.log('category', category);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Sejarah Transaksi' },
    { key: 'second', title: 'Pengeluaran' },
  ]);

  const requestWithdrawal = async () => {
    console.log('requestWithdrawal');
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000); // This will generate a random number between 0 and 999

    if (withdrawAmount <= 0) {
      setWithdrawError('Sila masukkan jumlah yang sah');
      return;
    }
    if (withdrawAmount > user?.wallet) {
      setWithdrawError('Baki tidak mencukupi');
      return;
    }

    const withdrawal = {
      amount: withdrawAmount,
      method: withdrawMethod,
      timestamp,
      user,
      id: `W${timestamp}${randomNum}`,
      status: 'pending',
    };

    try {
      await createWithdrawalRequest(withdrawal);
      await fetchUserFromFirestore(user, setUser);
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      bottomSheetModalRef.current?.close();
      setVisible(true);
    }
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        opacity={0.7}
      />
    ),
    [],
  );

  const renderItem = ({ item, index }) => {
    const date = moment(item.timestamp).format('D MMMM YYYY hh:mm a');
    const cat =
      (category && category.find((x) => x.id === item.items.category)) || null;

    return (
      <View style={{ marginHorizontal: 12 }}>
        <View style={styles.transaction}>
          <View style={styles.transactionInfoContainer}>
            <Text
              variant="labelSmall"
              style={{ color: style.colors.lightGray }}
            >
              #{item.id}
            </Text>
            <Text variant="titleMedium">
              {cat && cat.label} {item.items.weight}Kg
            </Text>
            {/* <Text variant="titleSmall">
              Kadar harga: RM{item.items.rate}/Kg
            </Text> */}
            <Text variant="titleSmall">{item.center.fasiliti}</Text>
            <Text
              variant="labelSmall"
              style={{ color: style.colors.lightGray }}
            >
              {date}
            </Text>

            <Text
              variant="bodyMedium"
              style={{
                color: style.colors.tertiary,
                fontSize: 16,
                marginTop: 5,
              }}
            >
              RM{item.items.price}
            </Text>
            <View style={styles.transactionStatusBackground(item.status)}>
              <Text style={styles.transactionStatusTitle(item.status)}>
                {i18n.t(`status.${item.status}`).toUpperCase()}
              </Text>
            </View>
            {item.status === 'rejected' && (
              <Text
                variant="bodyMedium"
                style={{
                  color: style.colors.accent,
                  fontSize: 14,
                  marginTop: 5,
                  fontWeight: 'bold',
                }}
              >
                Transaksi anda ditolak pada{' '}
                {moment(item.rejectedOn).format('D MMMM YYYY hh:mm a')} atas
                sebab: {item.reason}
              </Text>
            )}
          </View>
          <Image
            style={{
              width: 120,
              height: 140,
              borderRadius: 10,
              marginLeft: 10,
            }}
            source={{ uri: item.imageUrl }}
          />
        </View>

        <Divider />
      </View>
    );
  };

  const renderWithdrawal = ({ item, index }) => {
    const date = moment(item.timestamp).format('DD MMMM YYYY hh:mm a');

    return (
      <View style={{ marginHorizontal: 12 }}>
        <View style={styles.transaction}>
          <View style={styles.transactionInfoContainer}>
            <Text
              variant="labelSmall"
              style={{ color: style.colors.lightGray }}
            >
              #{item.id}
            </Text>
            <Text variant="labelMedium">{date}</Text>
            <Text
              variant="bodyMedium"
              style={{
                color: style.colors.tertiary,
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              RM{item.amount}
            </Text>
          </View>
          <View style={styles.transactionStatusBackground(item.status)}>
            <Text style={styles.transactionStatusTitle(item.status)}>
              {i18n.t(`status.${item.status}`).toUpperCase()}
            </Text>
          </View>
        </View>
        <Divider />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View
        style={{ alignSelf: 'center', alignItems: 'center', marginTop: 40 }}
      >
        <FontAwesome5Icon
          name="box-open"
          size={40}
          color={style.colors.background.dark.offBlack}
        />
        <Text color={style.colors.background.light.offwhite}>
          {i18n.t('Payments.noTransactions')}
        </Text>
      </View>
    );
  };

  const renderTxChartItem = () => {
    if (!txHistory.length) {
      return renderEmptyComponent();
    }
    const groupedData = txHistory.reduce((acc, item) => {
      const month = moment(item.timestamp).format('MMMM');
      if (!acc[month]) {
        acc[month] = { month, weight: 0 };
      }
      acc[month].weight += item.items.weight;
      return acc;
    }, {});
    const chartData = Object.values(groupedData);
    return (
      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: chartData.map((item) => item.month),
            datasets: [{ data: chartData.map((item) => item.weight) }],
          }}
          width={screenWidth}
          height={250}
          yAxisSuffix="Kg"
          fromZero
          yAxisInterval={0} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: style.colors.primary,
            backgroundGradientTo: style.colors.background.light.offwhite,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
          style={{
            borderRadius: 10,
            elevation: 5,
            margin: 10,
          }}
        />
      </View>
    );
  };

  const FirstRoute = () => (
    <View style={styles.container}>
      <FlatList
        data={[{ id: 'chart' }, ...txHistory]}
        renderItem={({ item }) =>
          item.id === 'chart' ? renderTxChartItem() : renderItem({ item })
        }
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchTransactions}
          />
        }
      />
    </View>
  );

  const renderWithdrawalChartItem = () => {
    if (!withdrawalHistory.length) {
      return renderEmptyComponent();
    }
    const groupedData = withdrawalHistory.reduce((acc, item) => {
      const month = moment(item.timestamp).format('MMMM');
      if (!acc[month]) {
        acc[month] = { month, amount: 0 };
      }
      acc[month].amount += item.amount;
      return acc;
    }, {});
    const chartData = Object.values(groupedData);
    return (
      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: chartData.map((item) => item.month),
            datasets: [{ data: chartData.map((item) => item.amount) }],
          }}
          width={screenWidth}
          height={250}
          yAxisLabel="RM"
          fromZero
          yAxisInterval={0} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: style.colors.primary,
            backgroundGradientTo: style.colors.background.light.offwhite,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
          style={{
            borderRadius: 10,
            elevation: 5,
            margin: 10,
          }}
        />
      </View>
    );
  };

  const SecondRoute = () => (
    <View style={styles.container}>
      <FlatList
        data={[{ id: 'chart' }, ...withdrawalHistory]}
        renderItem={({ item }) =>
          item.id === 'chart'
            ? renderWithdrawalChartItem()
            : renderWithdrawal({ item })
        }
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchWihdrawal} />
        }
      />
    </View>
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute />;
      case 'second':
        return <SecondRoute />;
      default:
        return null;
    }
  };

  return (
    <BottomSheetModalProvider>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          backgroundColor: style.colors.background.light.offwhite,
        }}
      >
        <View style={styles.balanceSection}>
          <Text style={styles.balanceText}>Baki Terkumpul</Text>
          <Text style={{ fontSize: 31, fontWeight: '900' }}>
            RM{user?.wallet || 0}
          </Text>
          <View style={styles.balanceButtonContainer}>
            <CustomButton
              icon="wallet"
              title={i18n.t('Payments.title')}
              onPress={handlePresentModalPress}
              color={style.colors.primary}
              style={{ width: 150, height: 40 }}
              // disabled={user?.wallet <= 0 || user?.wallet === undefined}
            />
            <CustomButton
              icon="gift"
              title={'Baucar'}
              onPress={() => navigation.navigate('Voucher', { user })}
              color={style.colors.primary}
              style={{ width: 150, height: 40, marginLeft: 10 }}
              // disabled={user?.wallet <= 0 || user?.wallet === undefined}
            />
          </View>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: style.colors.tertiary }}
              style={{
                backgroundColor: style.colors.background.light.offwhite,
              }}
              labelStyle={{ color: style.colors.text.primary }}
            />
          )}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
          keyboardDismissMode="none"
        >
          <View style={{ margin: 12 }}>
            <Text
              style={{ marginBottom: 10, fontSize: 20, fontWeight: 'bold' }}
            >
              Pengeluaran ke akaun bank
            </Text>
            <Text style={{ marginBottom: 10, fontSize: 15 }}>
              Pengeluaran maksimum: RM{user?.wallet}
            </Text>
            <TextInput
              label="Jumlah Pengeluaran"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              mode="outlined"
              style={{ marginBottom: 10 }}
              activeOutlineColor={style.colors.accent}
              outlineColor={style.colors.accent}
              returnKeyType="done"
            />
            {withdrawError && (
              <Text style={{ color: 'red', marginBottom: 10 }}>
                {withdrawError}
              </Text>
            )}
            <Button
              onPress={() => requestWithdrawal()}
              title="Sahkan"
              color={style.colors.tertiary}
            />
            <View
              style={{ flexDirection: 'row', marginVertical: 8, width: '90%' }}
            >
              <FontAwesome5Icon
                name="info-circle"
                size={18}
                color={style.colors.accent}
                style={{ margin: 5 }}
              />
              <Text style={{ color: style.colors.accent }}>
                Permohonan akan diproses dalam masa 24 jam. Anda akan menerima
                notifikasi apabila permohonan telah diproses.
              </Text>
            </View>
          </View>
        </BottomSheetModal>
        <Modal isVisible={visible} onBackdropPress={() => setVisible(false)}>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              backgroundColor: style.colors.secondary,
              borderRadius: 14,
              alignItems: 'center',
              width: 300,
              height: 200,
            }}
          >
            <Text>Permintaan pengeluaran telah dihantar </Text>
            <CustomButton
              title="Okay"
              onPress={() => {
                setVisible(false);
              }}
            />
          </View>
        </Modal>
      </View>
    </BottomSheetModalProvider>
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
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: style.colors.background.light.offwhite,
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
    color: style.colors.background.dark.offBlack,
  },
  transactionsList: {
    width: '100%',
    paddingHorizontal: 12,
  },
  transaction: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: style.colors.background.light.lightGray,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
  },
  transactionInfoContainer: {
    flex: 1,
  },
  statusContainer: {
    backgroundColor: style.colors.secondary,
    borderRadius: 5,
    alignSelf: 'center',
    padding: 12,
    marginTop: 10,
    justifyContent: 'center',
    elevation: 2,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionStatusTitle: (status) => ({
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color:
      status === 'pending'
        ? '#FFAA00'
        : status === 'rejected'
        ? '#AA0000'
        : '#006600',
  }),
  transactionStatusBackground: (status) => ({
    borderRadius: 5,
    marginVertical: 5,
    padding: 5,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      status === 'pending'
        ? '#FFF6D3'
        : status === 'rejected'
        ? '#FFE2E2'
        : '#E6FFE6',
    flex: 1,
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
  balanceButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});

export default PaymentScreen;
