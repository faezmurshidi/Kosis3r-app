import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      screen: {
        dashboard: 'Dashboard',
        login: 'Login',
        register: 'Register',
        transaction: 'Transaction',
        payment: 'Payment',
        profile: 'Profile',
        editProfile: 'Edit Profile',
      },
      login: 'Login',
      requestOtP: 'Request OTP',
      loginRegister: 'Login / Register',
      confirmPassword: 'Confirm Password',
      selectLanguage: 'Select Language',
      phoneNo: 'Phone Number',
      Dashboard: {
        title: 'Dashboard',
        greeting: 'Hi, ',
        balance: 'Current Balance',
        news: 'News',
      },
      Payments: {
        title: 'Withdraw',
        balance: 'Current Balance',
        transactionsHistory: 'Transactions History',
        earnings: 'Earnings',
        noTransactions: 'No transactions yet. Start recycling to earn points!',
        noEarned: 'No earnings yet. Start recycling to get earning reports!',
      },
      Profile: {
        title: 'Profile',
        userDetails: 'User Details',
        name: 'Name',
        email: 'Email',
        phone: 'Phone Number',
        language: 'Language',
        account: 'Account',
        editDetails: 'Edit Details',
        darkMode: 'Dark Mode',
        logout: 'Logout',
      },

      recycleCategories: [
        { label: 'Plastic', id: 35 },
        { label: 'Paper', id: 36 },
        { label: 'Metal', id: 37 },
        { label: 'Glass', id: 38 },
        { label: 'Fabric', id: 39 },
        { label: 'Tetrapak', id: 40 },
        { label: 'Rubber/Leather', id: 41 },
        { label: 'Wood', id: 42 },
        { label: 'Garden Waste', id: 43 },
        { label: 'Face Mask', id: 45 },
        { label: 'Hazardous Waste', id: 46 },
        { label: 'Food Waste', id: 76 },
        { label: 'Commingled Waste', id: 79 },
        { label: 'Other', id: 82 },
      ],
      status: {
        success: 'Berjaya',
        failed: 'Gagal',
        pending: 'Dalam Proses',
        approved: 'Diluluskan',
        rejected: 'Ditolak',
      },
    },
  },
  ms: {
    translation: {
      screen: {
        dashboard: 'Utama',
        login: 'Log Masuk',
        register: 'Daftar',
        transaction: 'Jualan',
        payment: 'Pembayaran',
        profile: 'Profil',
        editProfile: 'Edit Profil',
      },
      login: 'Log masuk',
      requestOtP: 'Minta OTP',
      loginRegister: 'Log masuk / Daftar',
      confirmPassword: 'Sahkan Kata Laluan',
      selectLanguage: 'Pilih Bahasa',
      phoneNo: 'No Telefon',
      Dashboard: {
        title: 'Papan Pemuka',
        greeting: 'Selamat Datang, ',
        balance: 'Baki Semasa',
        news: 'Berita',
      },
      Payments: {
        title: 'Pengeluaran',
        balance: 'Baki Semasa',
        transactionsHistory: 'Sejarah Transaksi',
        earnings: 'Pendapatan',
        noTransactions:
          'Tiada transaksi lagi. Mula mengitar semula untuk mendapatkan mata!',
        noEarned:
          'Tiada pendapatan lagi. Mula mengitar semula untuk mendapatkan laporan pendapatan!',
      },
      Profile: {
        title: 'Profil',
        userDetails: 'Maklumat Pengguna',
        name: 'Nama',
        email: 'Emel',
        phone: 'No Telefon',
        language: 'Bahasa',
        account: 'Akaun',
        editDetails: 'Edit Maklumat',
        darkMode: 'Mod Gelap',
        logout: 'Log Keluar',
      },
      recycleCategories: [
        { label: 'Plastik', id: 35 },
        { label: 'Kertas', id: 36 },
        { label: 'Logam', id: 37 },
        { label: 'Kaca', id: 38 },
        { label: 'Kain', id: 39 },
        { label: 'Tetrapak', id: 40 },
        { label: 'Getah/Kulit', id: 41 },
        { label: 'Kayu', id: 42 },
        { label: 'Sisa Kebun/Taman', id: 43 },
        { label: 'Pelitup Muka', id: 45 },
        { label: 'Sisa Merbahaya', id: 46 },
        { label: 'Sisa Makanan', id: 76 },
        { label: 'Comningle', id: 79 },
        { label: 'Lain-Lain', id: 82 },
      ],
      status: {
        success: 'Berjaya',
        failed: 'Gagal',
        pending: 'Dalam Proses',
        approved: 'Diluluskan',
        rejected: 'Ditolak',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ms',
  fallbackLng: 'ms',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
