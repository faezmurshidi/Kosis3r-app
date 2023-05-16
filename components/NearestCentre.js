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
  const [location, setLocation] = useState(null);
  const [nearestCenter, setNearestCenter] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (result === RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation(position.coords);
          },
          (error) => setErrorMsg(error.message),
          { enableHighAccuracy: true, timeout: 40000, maximumAge: 1800000 },
        );
      } else {
        setErrorMsg('Location permission not granted');
      }
    };

    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
      if (result === RESULTS.GRANTED) {
        // Permission already granted, get the location
        Geolocation.getCurrentPosition(
          (position) => {
            // Check if the cached location is expired (older than 30 minutes)
            const lastCachedTime = new Date(position.timestamp).getTime();
            const currentTime = Date.now();
            const isLocationExpired = currentTime - lastCachedTime > 1800000; // 30 minutes in milliseconds

            if (isLocationExpired) {
              // Request a new location
              requestLocationPermission();
            } else {
              // Use the cached location
              setLocation(position.coords);
            }
          },
          (error) => setErrorMsg(error.message),
          { enableHighAccuracy: true, timeout: 40000, maximumAge: 1800000 },
        );
      } else {
        // Request permission
        requestLocationPermission();
      }
    });
  }, []);

  const findNearestCenter = (lat, lon) => {
    let minDistance = Number.MAX_VALUE;
    let nearest = null;

    centers.forEach((state) => {
      state.locations.forEach((center) => {
        const distance = haversineDistance(
          lat,
          lon,
          center.latitud,
          center.longitud,
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = center;
        }
      });
    });

    setNearestCenter(nearest);
  };

  const openNavigationApp = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${nearestCenter.latitude},${nearestCenter.longitude}`;
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

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        findNearestCenter(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }, []);

  const mapViewRef = useRef(null);

  useEffect(() => {
    if (mapViewRef.current && location.latitude && location.longitude) {
      mapViewRef.current.fitToCoordinates(
        [
          {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          {
            latitude: nearestCenter.latitud,
            longitude: nearestCenter.longitud,
          },
        ],
        {
          edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
          animated: true,
        },
      );
    }
  }, [location, nearestCenter]);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <FontAwesome5Icon
          name="store"
          size={18}
          color={style.colors.accent}
          style={{ marginRight: 8, marginTop: 2 }}
        />
        <View>
          <Text style={styles.sectionTitle}>Pusat Kosis Terdekat</Text>
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
        visible={location && nearestCenter}
        style={{ width: '100%', height: 240 }}
      >
        {location && nearestCenter && (
          <MapView
            ref={mapViewRef}
            style={styles.map}
            initialRegion={{
              latitude: nearestCenter.latitud,
              longitude: nearestCenter.longitud,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
            />
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
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      {nearestCenter && (
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CustomButton
              onPress={() => onPress(nearestCenter)}
              title="Jualan"
              icon={'recycle'}
              load
            />
            <CustomButton
              onPress={openNavigationApp}
              title="Bawa saya ke sana"
              icon={'location-arrow'}
            />
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
    backgroundColor: style.colors.paper.ivory,
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
    color: style.colors.accent,
  },
  nearestRecyclingCenterText: {
    fontSize: 16,
    color: style.colors.text.primary,
    fontWeight: 'bold',
  },
});

export default NearestCentre;
