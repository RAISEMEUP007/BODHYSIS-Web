import React, { useState } from 'react';
import { ImageBackground, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';

import { resetPass } from '../api/Auth';
import { msgStr } from '../common/constants/Message';
import { useAlertModal } from '../common/hooks';

import { authStyles } from './styles/AuthStyles';

const RecoverPass = ({ navigation }) => {
  const { showAlert } = useAlertModal();

  const [email, setEmail] = useState('');
  const [emailValidMessage, setEmailValidMessage] = useState('');

  const sendResetPass = () => {
    if (!email.trim()) {
      setEmailValidMessage(msgStr('emptyField'));
      return;
    }

    resetPass(email, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          showAlert('success', msgStr('resetPasslinkSent'));
          break;
        case 404:
          setEmailValidMessage(msgStr('emailNotFound'));
          break;
        default:
          if (jsonRes?.message) showAlert('error', jsonRes.message);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const checkEmailInput = () => {
    if (!email.trim()) {
      setEmailValidMessage(msgStr('emptyField'));
    } else if (!isValidEmailFormat(email)) {
      setEmailValidMessage(msgStr('invalidEmailFormat'));
    } else {
      setEmailValidMessage('');
    }
  };

  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const login = () => {
    navigation.navigate('Auth');
  };

  return (
    <ImageBackground source={require('../assets/gradient-back.jpeg')} style={styles.image}>
      <View style={styles.card}>
        <Image source={require('../assets/icon.png')}></Image>
        <Text style={styles.heading}>{'Reset Password'}</Text>
        <View style={styles.form}>
          <View style={styles.inputs}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              onChangeText={setEmail}
              onBlur={checkEmailInput}
            ></TextInput>
            {emailValidMessage.trim() != '' && (
              <Text style={styles.message}>{emailValidMessage}</Text>
            )}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.button} onPress={sendResetPass}>
                <Text style={styles.buttonText}>{'Send'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonAlt} onPress={login}>
                <Text style={styles.buttonAltText}>{'Login'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = authStyles;

export default RecoverPass;
