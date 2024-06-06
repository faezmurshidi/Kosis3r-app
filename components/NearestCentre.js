import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import centers from '../assets/pusatkosis.json';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import NavigationButton from './NavigationButton';
import CustomButton from '../components/CustomButton';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import style from '../styles';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const NearestCentre = ({ onPress }) => {
  const nearestCenter = {
    id: 5,
    daerah: 'Kuala Terengganu',
    fasiliti: 'PPR Padang Hiliran',
    alamat:
      'Jalan Kampung Padang, Kampung Hiliran, 21200 Kuala Terengganu, Terengganu',
    no_telefon: ['011-10010780'],
    pegawai: ['Pn Hayati Shaffini@Ariffin'],
    jenis_fasiliti: 'Pusat Komuniti Sifar Sisa (KOSIS)',
    latitud: 5.31174,
    longitud: 103.12595,
    openingHours: [
      {
        open: '08:00',
        close: '17:00',
      }
    ],
  };

  const openNavigationApp = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${nearestCenter.latitud},${nearestCenter.longitud}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Can't open navigation app");
        }
      })
      .catch((error) => console.log(error));
  };

  const mapViewRef = useRef(null);

  const isStoreOpen = (openingHours) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
  
    // Assuming openingHours has only one opening period for simplicity
    const { open, close } = openingHours[0];
  
    // Parse opening and closing times
    const [openHour, openMinute] = open.split(':').map(Number);
    const [closeHour, closeMinute] = close.split(':').map(Number);
  
    // Convert times to minutes since midnight for easier comparison
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const openTimeInMinutes = openHour * 60 + openMinute;
    const closeTimeInMinutes = closeHour * 60 + closeMinute;
  
    // Check if current time is within the opening hours
    if (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes) {
      return true; // Store is open
    } else {
      return false; // Store is closed
    }
  }

  const centerOpen = isStoreOpen(nearestCenter.openingHours) ? 'Jual' : 'Pusat KOSIS Tutup';

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <FontAwesome5Icon
          name="store"
          size={19}
          color={style.colors.text.primary}
          style={{ marginRight: 8, marginTop: 2 }}
        />
        <View>
          <Text style={styles.sectionTitle}>Pusat KOSIS Terdekat</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#E9F1FB',
          borderRadius: 8,
          marginHorizontal: 14,
          marginVertical: 8,
        }}
      >
        {nearestCenter && (
          <MapView
            ref={mapViewRef}
            style={{ ...styles.map, width: '40%' }}
            initialRegion={{
              latitude: nearestCenter.latitud,
              longitude: nearestCenter.longitud,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: nearestCenter.latitud,
                longitude: nearestCenter.longitud,
              }}
              title={nearestCenter.fasiliti}
              description={nearestCenter.alamat}
            />
          </MapView>
        )}

        {nearestCenter && (
          <View style={{ flex: 1, padding: 4, justifyContent: 'space-evenly' }}>
            {nearestCenter && (
              <>
                <Text style={styles.nearestRecyclingCenterText}>
                  {nearestCenter.fasiliti}
                </Text>
                <Text>{nearestCenter.alamat}</Text>
              </>
            )}

            {/* <CustomButton
                onPress={openNavigationApp}
                title="Bawa saya ke sana"
                icon={'location-arrow'}
              /> */}
          </View>
        )}
      </View>
      <CustomButton
        onPress={() => onPress(nearestCenter)}
        title={centerOpen}
        icon={'money-bill-wave'}
        disabled={isStoreOpen(nearestCenter.openingHours) ? false : true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',

    marginTop: 6,
    // borderRadius: 18,
  },
  errorText: {
    fontSize: 9,
    color: 'red',
    marginBottom: 10,
    alignSelf: 'center',
  },
  map: {
    margin: 8,
    height: 150,
  },
  section: {
    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: style.colors.text.primary,
  },
  nearestRecyclingCenterText: {
    fontSize: 17,
    color: style.colors.tertiary,
    fontWeight: 'bold',
  },
});

export default NearestCentre;
