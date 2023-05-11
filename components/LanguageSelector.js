// components/LanguageSelector.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import style from '../styles';
import Icon from 'react-native-ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const LanguageSelector = ({ selectedLanguage, onSelectLanguage }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageChange = (language) => {
    onSelectLanguage(language);
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.languageButtonContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[styles.languageButton, { borderColor: style.colors.accent }]}
        >
          <FontAwesome5 name="globe" size={16} color={style.colors.accent} />
          <Text style={styles.languageButtonText}>
            {selectedLanguage === 'en' ? 'English' : 'Bahasa Malaysia'}
          </Text>
          <FontAwesome5
            name="caret-down"
            size={16}
            color={style.colors.accent}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Select Language: </Text>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={styles.optionText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleLanguageChange('ms')}
            >
              <Text style={styles.optionText}>Bahasa Malaysia</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    borderRadius: 100,
    borderWidth: 1,
    paddingVertical: 3,
    paddingLeft: 6,
    paddingRight: 10,
  },
  languageButtonText: {
    lineHeight: 24,
    paddingHorizontal: 10,
    color: style.colors.accent,
  },
  languageButtonContainer: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 23,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    marginBottom: 16,
  },
  optionText: {
    fontSize: 18,
  },
});

export default LanguageSelector;
