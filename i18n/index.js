import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: 'Login',
      Dashboard: {
        title: 'Dashboard',
        balance: 'Current Balance',
      },
      recycleCategories: [
        'Paper',
        'Cardboard',
        'Plastic bottles',
        'Plastic containers',
        'Glass bottles',
        'Glass jars',
        'Aluminum cans',
        'Steel cans',
        'Tin cans',
        'Electronics',
        'Batteries',
        'Textiles',
        'Furniture',
        'Yard waste',
        'Food waste',
        'Metal scrap',
        'Ink cartridges',
        'Fluorescent bulbs',
        'Appliances',
      ],
    },
  },
  ms: {
    translation: {
      login: 'Log masuk',
      Dashboard: {
        title: 'Papan Pemuka',
        balance: 'Baki Semasa',
      },
      recycleCategories: [
        'Kertas',
        'Kadbod',
        'Botol plastik',
        'Bekas plastik',
        'Botol kaca',
        'Balang kaca',
        'Tin aluminium',
        'Tin keluli',
        'Tin',
        'Elektronik',
        'Bateri',
        'Tekstil',
        'Perabot',
        'Sisa halaman',
        'Sisa makanan',
        'Besi buruk',
        'Katrij dakwat',
        'Lampu pendarfluor',
        'Alat elektrik',
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
