import React, { useState } from 'react';
import { ImageBackground, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { login, signup } from '../api/Auth';
import { msgStr } from '../common/constants/Message';
import { useAlertModal } from '../common/hooks/UseAlertModal';

import { authStyles } from './styles/AuthStyles';

const AuthScreen = () => {
  const navigation = useNavigation();
  const { showAlert } = useAlertModal();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [isLogin, setIsLogin] = useState(true);

  const [emailValidMessage, setEmailValidMessage] = useState('');
  const [nameValidMessage, setNameValidMessage] = useState('');
  const [passValidMessage, setPassValidMessage] = useState('');

  const onChangeHandler = () => {
    resetValidMessage();
    setIsLogin(!isLogin);
  };

  const onLoggedIn = async (token) => {
    await AsyncStorage.setItem('access-token', token);
    navigation.navigate('Home');
  };

  const onSubmitHandler = () => {
    if (!email.trim()) {
      setEmailValidMessage(msgStr('emptyField'));
      return;
    } else if (!password.trim()) {
      setPassValidMessage(msgStr('emptyField'));
      return;
    }

    if (isLogin) {
      login(email, password, (jsonRes, status, error) => {
        resetValidMessage();
        switch (status) {
          case 200:
            onLoggedIn(jsonRes.refreshToken);
            break;
          case 403:
            setPassValidMessage(msgStr('errorComparingPassword'));
            break;
          case 404:
            setEmailValidMessage(msgStr('userNotFound'));
            break;
          case 500:
            showAlert('error', msgStr('serverError'));
            break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      });
    } else {
      signup(email, password, name, (jsonRes, status, error) => {
        resetValidMessage();
        switch (status) {
          case 200:
            onChangeHandler();
            showAlert('success', msgStr('userCreated'));
            break;
          case 409:
            setEmailValidMessage(msgStr('emailExists'));
            break;
          case 500:
            showAlert('error', msgStr('serverError'));
            break;
          default:
            if (res.message) showAlert('error', res.message);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      });
    }
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

  const resetValidMessage = () => {
    setEmailValidMessage('');
    setNameValidMessage('');
    setPassValidMessage('');
  };

  const checkNameInput = () => {
    if (!name.trim()) {
      setNameValidMessage(msgStr('emptyField'));
    } else {
      setNameValidMessage('');
    }
  };

  const checkPasswordInput = () => {
    if (!password.trim()) {
      setPassValidMessage(msgStr('emptyField'));
    } else {
      setPassValidMessage('');
    }
  };

  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const forgotPass = () => {
    navigation.navigate('RecoverPass');
  };

  return (
    <ImageBackground source={require('../assets/gradient-back.jpeg')} style={styles.image}>
      <View style={styles.card}>
        <Image style={styles.icon} source={require('../assets/icon.png')}></Image>
        <Text style={styles.heading}>{isLogin ? 'Login' : 'Signup'}</Text>
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
            {!isLogin && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  onChangeText={setName}
                  onBlur={checkNameInput}
                />
                {nameValidMessage.trim() !== '' && (
                  <Text style={styles.message}>{nameValidMessage}</Text>
                )}
              </>
            )}
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              placeholder="Password"
              onChangeText={setPassword}
              onBlur={checkPasswordInput}
              onSubmitEditing={onSubmitHandler}
            ></TextInput>
            {passValidMessage.trim() != '' && (
              <Text style={[styles.message, { marginBottom: 0 }]}>{passValidMessage}</Text>
            )}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Continue'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonAlt} onPress={onChangeHandler}>
                <Text style={styles.buttonAltText}>{isLogin ? 'Create Account' : 'Login'}</Text>
              </TouchableOpacity>
              {isLogin && (
                <>
                  <TouchableOpacity style={[styles.forgotPass]} onPress={forgotPass}>
                    <Text style={styles.forgotLink}>{'forgot password?'}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = authStyles;

export default AuthScreen;
