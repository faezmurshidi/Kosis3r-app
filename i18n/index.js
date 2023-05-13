import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: 'Login',
      loginRegister: 'Login / Register',
      selectLanguage: 'Select Language',
      phoneNo: 'Phone Number',
      Dashboard: {
        title: 'Dashboard',
        balance: 'Current Balance',
        news: 'News',
      },
      Payments: {
        title: 'Payments',
        balance: 'Current Balance',
        transactionsHistory: 'Transactions History',
        noTransactions: 'No transactions yet. Start recycling to earn points!',
      },
      recycleCategories: [
        { label: 'Paper', value: 'paper' },
        { label: 'Cardboard', value: 'cardboard' },
        { label: 'Plastic bottles', value: 'plastic bottles' },
        { label: 'Plastic containers', value: 'plastic containers' },
        { label: 'Glass bottles', value: 'glass bottles' },
        { label: 'Glass jars', value: 'glass jars' },
        { label: 'Aluminum cans', value: 'aluminum cans' },
        { label: 'Steel cans', value: 'steel cans' },
        { label: 'Tin cans', value: 'tin cans' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Batteries', value: 'batteries' },
        { label: 'Textiles', value: 'textiles' },
        { label: 'Furniture', value: 'furniture' },
        { label: 'Yard waste', value: 'yard waste' },
        { label: 'Food waste', value: 'food waste' },
        { label: 'Metal scrap', value: 'metal scrap' },
        { label: 'Ink cartridges', value: 'ink cartridges' },
        { label: 'Fluorescent bulbs', value: 'fluorescent bulbs' },
        { label: 'Appliances', value: 'appliances' },
      ],
    },
  },
  ms: {
    translation: {
      login: 'Log masuk',
      loginRegister: 'Log masuk / Daftar',
      selectLanguage: 'Pilih Bahasa',
      phoneNo: 'No Telefon',
      Dashboard: {
        title: 'Papan Pemuka',
        balance: 'Baki Semasa',
        news: 'Berita',
      },
      Payments: {
        title: 'Pembayaran',
        balance: 'Baki Semasa',
        transactionsHistory: 'Sejarah Transaksi',
        noTransactions:
          'Tiada transaksi lagi. Mula mengitar semula untuk mendapatkan mata!',
      },
      recycleCategories: [
        { label: 'Paper', value: 'paper' },
        { label: 'Cardboard', value: 'cardboard' },
        { label: 'Plastic Bottles', value: 'plastic bottles' },
        { label: 'Plastic Containers', value: 'plastic containers' },
        { label: 'Glass Bottles', value: 'glass bottles' },
        { label: 'Glass Jars', value: 'glass jars' },
        { label: 'Aluminum Cans', value: 'aluminum cans' },
        { label: 'Steel Cans', value: 'steel cans' },
        { label: 'Tin Cans', value: 'tin cans' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Batteries', value: 'batteries' },
        { label: 'Textiles', value: 'textiles' },
        { label: 'Furniture', value: 'furniture' },
        { label: 'Yard Waste', value: 'yard waste' },
        { label: 'Food Waste', value: 'food waste' },
        { label: 'Metal Scrap', value: 'metal scrap' },
        { label: 'Ink Cartridges', value: 'ink cartridges' },
        { label: 'Fluorescent Bulbs', value: 'fluorescent bulbs' },
        { label: 'Appliances', value: 'appliances' },
      ],
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
