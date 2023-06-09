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

  // variables
  const snapPoints = useMemo(() => ['25%', '30%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
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
    { key: 'first', title: i18n.t('Payments.transactionsHistory') },
    { key: 'second', title: i18n.t('Payments.earnings') },
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

  const renderItem = ({ item, index }) => {
    const date = moment(item.timestamp).format('DD MMMM YYYY');
    const cat =
      (category && category.find((x) => x.id === item.items.category)) || null;

    return (
      <View>
        <View style={styles.transaction}>
          <View style={styles.transactionInfoContainer}>
            <Text variant="titleSmall">{date}</Text>
            <Text variant="bodySmall">
              {item.items.weight}KG of {cat && cat.label} @ RM
              {item.items.rate}
              /Kg
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: style.colors.accent, fontSize: 16 }}
            >
              RM{item.items.price}
            </Text>
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 10,
                marginRight: 14,
              }}
              source={{ uri: item.imageUrl }}
            />
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.indicator(item.status)} />
            <Text style={styles.transactionStatus(item.status)}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Divider />
      </View>
    );
  };

  const renderWithdrawal = ({ item, index }) => {
    const date = moment(item.timestamp).format('DD MMMM YYYY');

    return (
      <View>
        <View style={styles.transaction}>
          <View style={styles.transactionInfoContainer}>
            <Text variant="titleSmall">{date}</Text>

            <Text
              variant="bodyMedium"
              style={{ color: style.colors.accent, fontSize: 16 }}
            >
              RM{item.amount}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.indicator(item.status)} />
            <Text style={styles.transactionStatus(item.status)}>
              {item.status.toUpperCase()}
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
          <Text style={styles.balanceText}>{i18n.t('Payments.balance')}</Text>
          <Text style={{ fontSize: 31, fontWeight: '900' }}>
            RM{user?.wallet}
          </Text>
          <CustomButton
            icon="wallet"
            title={i18n.t('Payments.title')}
            onPress={handlePresentModalPress}
            color={style.colors.primary}
          />
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: style.colors.primary }}
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
  transactionStatus: (status) => ({
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '500',
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
});

export default PaymentScreen;
