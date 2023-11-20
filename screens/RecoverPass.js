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
    const [password, setPassword] = useState('');

    const [emailValidMessage, setEmailValidMessage] = useState('');
    const [passValidMessage, setPassValidMessage] = useState('');
    
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
        setPassValidMessage('');
    }

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
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Send</Text>
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