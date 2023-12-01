import React, { useEffect } from 'react';
import { View, Text, Image, Platform, Button } from 'react-native';

const MainIcon = ({ navigation }) => {
    useEffect(()=>{
        navigation.jumpTo('Dashboard', { owner: 'Satya' });
    }, []);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home!</Text>
            <Button
            title="Go to Dashboard"
            onPress={() => navigation.jumpTo('Dashboard')}
            />
        </View>
    );
};

export default MainIcon;
