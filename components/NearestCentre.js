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

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <FontAwesome5Icon
          name="store"
          size={18}
          color={style.colors.text.primary}
          style={{ marginRight: 8, marginTop: 2 }}
        />
        <View>
          <Text style={styles.sectionTitle}>Pusat Kosis Terdekat</Text>
          {/* {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>} */}
          <ShimmerPlaceholder visible={nearestCenter} style={{ width: '100%' }}>
            {nearestCenter && (
              <Text style={styles.nearestRecyclingCenterText}>
                {nearestCenter.fasiliti}
              </Text>
            )}
          </ShimmerPlaceholder>
        </View>
      </View>
      <ShimmerPlaceholder
        visible={nearestCenter}
        style={{ width: '100%', height: 240 }}
      >
        {nearestCenter && (
          <MapView
            ref={mapViewRef}
            style={styles.map}
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
      </ShimmerPlaceholder>

      {nearestCenter && (
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CustomButton
              onPress={() => onPress(nearestCenter)}
              title="Jualan"
              icon={'recycle'}
              load
            />
            {/* <CustomButton
              onPress={openNavigationApp}
              title="Bawa saya ke sana"
              icon={'location-arrow'}
            /> */}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F6FFF8',
    marginTop: 6,
    borderRadius: 18,
    marginHorizontal: 12,
  },
  errorText: {
    fontSize: 9,
    color: 'red',
    marginBottom: 10,
    alignSelf: 'center',
  },
  map: {
    padding: 12,
    height: 240,
    borderRadius: 8,
  },
  section: {
    padding: 12,
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: style.colors.text.primary,
  },
  nearestRecyclingCenterText: {
    fontSize: 16,

    color: style.colors.accent,
    fontWeight: 'bold',
  },
});

export default NearestCentre;
