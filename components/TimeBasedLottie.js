// TimeBasedLottie.js
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';

const TimeBasedLottie = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  const getCurrentAnimation = () => {
    const currentHour = new Date().getHours();
    const isMorning = currentHour >= 6 && currentHour <= 18;
    return isMorning
      ? require('../assets/morning.json')
      : require('../assets/night.json');
  };

  return (
    <LottieView
      ref={animationRef}
      source={getCurrentAnimation()}
      loop={false}
      style={{ width: '100%', height: 300 }}
    />
  );
};

export default TimeBasedLottie;
