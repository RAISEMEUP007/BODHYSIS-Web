import React, { useState } from 'react';
import { ImageBackground, View, Image, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { API_URL } from '../common/constants/appConstants';
import { defaultFontSize } from '../common/constants/fonts';
import { msgStr } from '../common/constants/message';

import { useAlertModal } from '../common/hooks/useAlertModal';

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

    const onLoggedIn = token => {
        fetch(`${API_URL}/private`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    navigation.navigate('Home');
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
            showAlert('error', msgStr('serverError'));
        });
    }

    const onSubmitHandler = () => {
        if(!email.trim()){
            setEmailValidMessage(msgStr('emptyField'));
            return;
        }else if(!password.trim()){
            setPassValidMessage(msgStr('emptyField'));
            return;
        }

        const payload = {
            email,
            name,
            password,
        };
        fetch(`${API_URL}/${isLogin ? 'login' : 'signup'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            resetValidMessage();
            switch(res.status){
                case 200:
                    if(!isLogin){
                        onChangeHandler();
                        showAlert('success', msgStr('userCreated'));
                    }
                    break;
                case 400:
                    break;
                case 401:
                    setPassValidMessage(msgStr('errorComparingPassword'));
                    break;
                case 404:
                    setEmailValidMessage(msgStr('userNotFound'));
                    break;
                case 409:
                    setEmailValidMessage(msgStr('emailExists'));
                    showAlert('error', msgStr('emailExists'));
                    break;
                default:
                    if(res.message) showAlert('error', res.message);
                    else showAlert('error', msgStr('unknownError'));
                    break;
            }
            try {
                const jsonRes = await res.json();
                if (res.status == 200) {
                    onLoggedIn(jsonRes.token);
                }
            } catch (err) {
                console.log(err);
            };
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

    const resetValidMessage = () => {
        setEmailValidMessage('');
        setNameValidMessage('');
        setPassValidMessage('');
    }

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

    return (
        <ImageBackground source={require('../assets/gradient-back.jpeg')} style={styles.image}>
            <View style={styles.card}>
                <Image style={styles.icon} source={require('../assets/icon.png')}></Image>
                <Text style={styles.heading}>{isLogin ? 'Login' : 'Signup'}</Text>
                <View style={styles.form}>
                    <View style={styles.inputs}>
                        <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail} onBlur={checkEmailInput}></TextInput>
                        {(emailValidMessage.trim() != '') && <Text style={styles.message}>{emailValidMessage}</Text>}
                        {!isLogin && (
                        <>
                            <TextInput style={styles.input} placeholder="Name" onChangeText={setName} onBlur={checkNameInput}/>
                            {nameValidMessage.trim() !== "" && <Text style={styles.message}>{nameValidMessage}</Text>}
                        </>)}
                        <TextInput secureTextEntry={true} style={styles.input} placeholder="Password" onChangeText={setPassword} onBlur={checkPasswordInput}></TextInput>
                        {(passValidMessage.trim() != '') && <Text style={[styles.message, {marginBottom: 0}]}>{passValidMessage}</Text>}
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                                <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Continue'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonAlt} onPress={onChangeHandler}>
                                <Text style={styles.buttonAltText}>{isLogin ? 'Create Account' : 'Login'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>    
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },  
    card: {
        fontSize: defaultFontSize,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: '80%',
        maxWidth : 480,
        marginTop: Platform.OS == 'web' ? 'calc(40VH - 220px)' : '32%',
        borderRadius: 20,
        paddingTop: defaultFontSize,
        paddingBottom: Platform.OS == 'web' ? defaultFontSize * 4 : defaultFontSize * 3,
        paddingHorizontal: defaultFontSize*3,
    },
    icon: {
        height: 110,
        width: 'auto',
        resizeMode: 'contain',
        justifyContent: 'center',
    },
    heading: {
        fontSize: defaultFontSize * 1.6,
        fontWeight: 'bold',
        marginTop: defaultFontSize/2,
        marginBottom: defaultFontSize * 1.2,
        color: 'black',
    },
    form: {
        justifyContent: 'space-between',
    },
    inputs: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },  
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        fontSize: defaultFontSize,
        padding: defaultFontSize/2,
        marginBottom: 10,
    },
    buttonGroup: {
        marginTop: defaultFontSize * 1.5,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '100%',
        backgroundColor: 'black',
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: defaultFontSize,
    },
    buttonAlt: {
        width: '100%',
        borderWidth: 1,
        height: 40,
        borderRadius: 50,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    buttonAltText: {
        color: 'black',
        fontSize: defaultFontSize,
    },
    message: {
        width: '100%',
        color: 'red',
        marginBottom: 3,
        marginTop: -defaultFontSize/2,
        fontSize: defaultFontSize * 0.8,
        paddingLeft: defaultFontSize/2,
    },
});

export default AuthScreen;