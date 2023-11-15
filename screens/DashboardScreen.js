import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DashboardScreen = ({ navigation }) => {
  
    const onLogout = () => {
        // Perform logout actions, e.g., clear token, navigate to AuthScreen
        navigation.navigate('Auth'); // Assuming the name of the AuthScreen is 'Auth'
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Dashboard</Text>
            <TouchableOpacity onPress={onLogout} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default DashboardScreen;
