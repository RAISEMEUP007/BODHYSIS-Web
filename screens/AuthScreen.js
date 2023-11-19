import React, { useState } from 'react';
import { ImageBackground, View, Image, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { API_URL } from '../common/constants/appConstants';
import { defaultFontSize } from '../common/constants/fonts';
import { msgStr } from '../common/constants/mess';

import { useAlertModal } from '../common/hooks/useAlertModal';

const AuthScreen = () => {
    const navigation = useNavigation();
    const { showAlert } = useAlertModal();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const [isError, setIsError] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const onChangeHandler = () => {
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
                    showAlert('success', 'Welcome!', 'Okay');
                }
            } catch (err) {
                console.log(err);
                showAlert('error');
            };
        })
        .catch(err => {
            console.log(err);
            showAlert('error');
        });
    }

    const onSubmitHandler = () => {
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
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    setIsError(true);
                } else {
                    onLoggedIn(jsonRes.token);
                    setIsError(false);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <ImageBackground source={require('../assets/gradient-back.jpeg')} style={styles.image}>
            <View style={styles.card}>
                <Image style={styles.icon} source={require('../assets/icon.png')}></Image>
                <Text style={styles.heading}>{isLogin ? 'Login' : 'Signup'}</Text>
                <View style={styles.form}>
                    <View style={styles.inputs}>
                        <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail}></TextInput>
                        {!isLogin && <TextInput style={styles.input} placeholder="Name" onChangeText={setName}></TextInput>}
                        <TextInput secureTextEntry={true} style={styles.input} placeholder="Password" onChangeText={setPassword}></TextInput>
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
        marginTop: Platform.OS == 'web' ? 'calc(40VH - 200px)' : '35%',
        borderRadius: 20,
        paddingTop: defaultFontSize,
        paddingBottom: Platform.OS == 'web' ? defaultFontSize * 4 : defaultFontSize * 3,
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
        marginLeft: '10%',
        marginTop: defaultFontSize,
        marginBottom: defaultFontSize * 1.5,
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
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        fontSize: defaultFontSize,
        padding: defaultFontSize/2,
        marginBottom: 10,
    },
    buttonGroup: {
        marginTop: defaultFontSize * 1.5,
        width: "80%",
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
});

export default AuthScreen;