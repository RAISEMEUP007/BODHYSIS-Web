import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import TouchNavGroup from '../../common/components/navpanel/TouchNavGroup';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import LocationManager from './locationmanager/Locations';
import Forecasting from './forecasting/Forecasting';

interface Props {
    navigation: any;
    initialItem?: string;
}

const Marketing = ({navigation, initialItem }:Props) => {
    const [selectedItem, setSelectedItem] = useState<string>(initialItem);
    
    const handleItemClick = (itemName) => {
        setSelectedItem(itemName);
    };
    
    if(selectedItem) {
        switch (selectedItem) {
            case 'Locations':
                return <LocationManager navigation={navigation} openMarketingMenu={handleItemClick}/>;
            case 'Forecasting':
                return <Forecasting navigation={navigation} openMarketingMenu={handleItemClick}/>;
            default:
                return (
                    <View style={{ marginTop: 20, paddingHorizontal: 10, paddingVertical:2, height: 28, justifyContent: 'center', flexDirection: 'row',}}>
                        <TouchableOpacity  onPress={() => handleItemClick(null)}>
                            <Text>{'< Back'}</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 28 }}>{selectedItem}</Text>
                    </View>
                );
        }
    };

    return (
        <BasicLayout
            navigation={navigation}
            screenName={"Marketing"}
        >
            <ScrollView>
                <View style={styles.container}>
                    <TouchNavGroup sectionTitle="Marketing" items={[
                        { title: "Locations", icon: 'map-marker-alt' },
                        { title: "Forecasting", icon: 'th' },
                    ]} handleItemClick={handleItemClick} />
                </View>
            </ScrollView>
        </BasicLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '90%',
        maxWidth: 1000,
        margin: 'auto',
        marginTop: 40,
    },
});

export default Marketing;
