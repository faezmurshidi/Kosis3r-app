import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import centers from '../assets/pusatkosis.json';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const NearestCentre = () => {
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
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
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
            setLocation(position.coords);
          },
          (error) => setErrorMsg(error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
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
      console.log('test', state);
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

  console.log('nearestCenter', nearestCenter);
  console.log('location', location);

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
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pusat Kosis Terdekat</Text>
        {nearestCenter && (
          <Text style={styles.nearestRecyclingCenterText}>
            {nearestCenter.fasiliti}
          </Text>
        )}
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AFEEEE',
    marginTop: 6,
    borderRadius: 8,
    elevation: 4,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  map: {
    width: Dimensions.get('window').width,
    height: 240,
    borderRadius: 8,
  },
  section: {
    backgroundColor: '#AFEEEE',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1A237E',
  },
  nearestRecyclingCenterText: {
    fontSize: 16,
    color: '#4A4A4A',
    fontWeight: 'bold',
  },
});

export default NearestCentre;
