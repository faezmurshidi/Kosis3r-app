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
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import PagerView from 'react-native-pager-view';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import i18n from '../i18n';

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
import Voucher from '../components/Voucher';

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
  const snapPoints = useMemo(() => ['25%', '30%'], []);
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
    if (withdrawAmount <= 0) {
      setWithdrawError('Please enter a valid amount');
      return;
    }
    if (withdrawAmount > user?.wallet) {
      setWithdrawError('Insufficient balance');
      return;
    }

    const withdrawal = {
      amount: withdrawAmount,
      method: withdrawMethod,
      timestamp: Date.now(),
      user,
      status: 'pending',
    };

    try {
      await createWithdrawalRequest(withdrawal);
      await fetchUserFromFirestore(user, setUser);
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      hideDialog();
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
      <View>
        <View style={styles.transaction}>
          <View style={styles.transactionInfoContainer}>
            <Text variant="titleMedium">
              {cat && cat.label} {item.items.weight}Kg
            </Text>
            <Text variant="titleSmall">
              Kadar harga: RM{item.items.rate}/Kg
            </Text>
            <Text variant="labelSmall">{date}</Text>

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
            <View style={styles.statusContainer}>
              <View style={styles.indicator(item.status)} />
              <Text style={styles.transactionStatus(item.status)}>
                {i18n.t(`status.${item.status}`).toUpperCase()}
              </Text>
            </View>
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
      <>
        <View style={styles.transaction}>
          <View style={styles.transactionInfoContainer}>
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
          <View
            style={{
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                item.status === 'pending'
                  ? 'yellow'
                  : item.status === 'cancelled'
                  ? 'red'
                  : 'green',
              flex: 1,
            }}
          >
            <Text style={styles.transactionStatus(item.status)}>
              {i18n.t(`status.${item.status}`).toUpperCase()}
            </Text>
          </View>
        </View>
        <Divider />
      </>
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

  const FirstRoute = () => (
    <View
      style={{
        flex: 1,
      }}
    >
      <FlatList
        style={styles.transactionsList}
        data={txHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchTransactions}
          />
        }
      />
      {/* <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.viewAll}>View All</Text>
      </TouchableOpacity> */}
    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1, margin: 12 }}>
      {/* <View
        style={{ alignSelf: 'center', alignItems: 'center', marginTop: 40 }}
      >
        <FontAwesome5Icon
          name="chart-line"
          size={40}
          color={style.colors.background.dark.offBlack}
        />
        <Text color={style.colors.background.light.offwhite}>
          {i18n.t('Payments.noEarned')}
        </Text>
      </View> */}
      <FlatList
        style={styles.transactionsList}
        data={withdrawalHistory}
        renderItem={renderWithdrawal}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchWihdrawal} />
        }
      />
      {/* <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{ data: [50, 100, 150, 200, 250] }],
        }}
        width={screenWidth}
        height={250}
        chartConfig={{
          backgroundColor: style.colors.background.light.offwhite,
          backgroundGradientFrom: style.colors.background.light.offwhite,
          backgroundGradientTo: style.colors.background.light.offwhite,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        bezier
      /> */}
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

  const vouchers = [
    {
      id: '1',
      title: 'RM 50 Voucher',
      description: 'RM 5 OFF on your next purchase',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/kosis-dev.appspot.com/o/images%2Fkfc_logo.png?alt=media&token=0fde565d-cde5-43a2-8ae7-e7d1102a3a3a',
      expiry: '31/12/2021',
    },
    {
      id: '2',
      title: 'RM 100 Voucher',
      description: 'RM 10 OFF on your next purchase',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/kosis-dev.appspot.com/o/images%2Fkfc_logo.png?alt=media&token=0fde565d-cde5-43a2-8ae7-e7d1102a3a3a',
      expiry: '31/12/2021',
    },
  ];

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
          <Text style={styles.balanceText}>Wallet</Text>
          <Text style={{ fontSize: 31, fontWeight: '900' }}>
            RM{user?.wallet}
          </Text>
          <View style={styles.balanceButtonContainer}>
            <CustomButton
              icon="wallet"
              title={i18n.t('Payments.title')}
              onPress={handlePresentModalPress}
              color={style.colors.primary}
              style={{ width: 150, height: 40 }}
            />
            <CustomButton
              icon="gift"
              title={'Baucar'}
              onPress={handleVoucherModalPress}
              color={style.colors.primary}
              style={{ width: 150, height: 40, marginLeft: 10 }}
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
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
        >
          <View style={{}}>
            <View style={{ padding: 12 }}>
              <Text style={{ marginBottom: 10 }}>
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
                outlineColor={style.colors.secondary}
                returnKeyType="done"
              />
              {withdrawError && (
                <Text style={{ color: 'red', marginBottom: 10 }}>
                  {withdrawError}
                </Text>
              )}
              <Button
                onPress={() => requestWithdrawal()}
                title="Confirm"
                color={style.colors.primary}
                style={{ borderRadius: 10 }}
              />
            </View>
          </View>
        </BottomSheetModal>
        <BottomSheetModal
          ref={redeemVoucherRef}
          index={1}
          snapPoints={snapPointsVoucher}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
        >
          <Voucher vouchers={vouchers} />
        </BottomSheetModal>
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
  transactionStatus: (status) => ({
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: style.colors.text.primary,
  }),
  indicator: (status) => ({
    width: 12,
    height: 12,
    borderRadius: 5,
    borderColor: style.colors.background.light.lightGray,
    borderWidth: 2,
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
  balanceButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});

export default PaymentScreen;
