import React, { useState } from 'react';
import { ImageBackground, View, Image, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { API_URL } from '../common/constants/appConstants';
import { msgStr } from '../common/constants/message';

import { authStyles } from './styles/authStyles';
import { useAlertModal } from '../common/hooks/useAlertModal';

const RecoverPass = () => {
    const navigation = useNavigation();
    const { showAlert } = useAlertModal();

    const [email, setEmail] = useState('');
    const [emailValidMessage, setEmailValidMessage] = useState('');
    
    const getCurrentHost = () => {
        if (typeof window !== 'undefined') {
          return window.location.host;
        } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
          Linking.getInitialURL()
            .then((url) => {
              if (url) {
                const host = new URL(url).host;
                console.log(host);
                return host;
              }
            })
            .catch((err) => {
              console.error('An error occurred', err);
              return null;
            });
        } else {
          return null;
        }
    };

    const sendResetPass = () => {
        if(!email.trim()){
            setEmailValidMessage(msgStr('emptyField'));
            return;
        }

        const payload = {
            email,
            clientHost: getCurrentHost(),
        };

        fetch(`${API_URL}/resetpass`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            switch(res.status){
                case 200:
                    showAlert('success', msgStr('resetPasslinkSent'));
                break;
                case 404:
                    setEmailValidMessage(msgStr('emailNotFound'));
                    break;
                default:
                    if(res.message) showAlert('error', res.message);
                    else showAlert('error', msgStr('unknownError'));
                    break;
            }
        })
        .catch(err => {
            console.log(err);
            showAlert('error', msgStr('serverError'));
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
                <Image style={styles.icon} source={require('../assets/icon.png')}></Image>
                <Text style={styles.heading}>{'Reset Password'}</Text>
                <View style={styles.form}>
                    <View style={styles.inputs}>
                        <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail} onBlur={checkEmailInput}></TextInput>
                        {(emailValidMessage.trim() != '') && <Text style={styles.message}>{emailValidMessage}</Text>}
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