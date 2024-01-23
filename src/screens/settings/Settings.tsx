import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import TouchNavGroup from '../../common/components/navpanel/TouchNavGroup';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';

import Manufactures from './manufactures/Manufactures';
import Tags from './tags/Tags';
import Locations from './locations/Locations';

import { ScrollView } from 'react-native-gesture-handler';
import Documents from './documents/Documents';
import ReservationTypes from './reservationtypes/ReservationTypes';
import Trucks from './trucks/Trucks';
import StoreDetails from './storedetails/StoreDetails';
import DiscountCodes from './dicountcodes/DiscountCodes';
import Taxcodes from './taxcodes/Taxcodes';
import Colorcombinations from './colorcombinations/Colorcombinations';

const Settings = ({navigation, initalItem = null}) => {
    const [selectedItem, setSelectedItem] = useState(initalItem);
    
    const handleItemClick = (itemName) => {
        setSelectedItem(itemName);
    };
    
    if(selectedItem) {
        switch (selectedItem) {
            case 'Manufactures':
                return <Manufactures navigation={navigation} openInventory={handleItemClick}/>;
            case 'Tag Management':
                return <Tags navigation={navigation} openInventory={handleItemClick}/>;
            case 'Locations':
                return <Locations navigation={navigation} openInventory={handleItemClick}/>;
            case 'Document Management':
                return <Documents navigation={navigation} openInventory={handleItemClick}/>;
            case 'Reservation Types':
                return <ReservationTypes navigation={navigation} openInventory={handleItemClick}/>;
            case 'Trucks':
                return <Trucks navigation={navigation} openInventory={handleItemClick}/>;
            // case 'Store Details':
            //     return <StoreDetails navigation={navigation} openInventory={handleItemClick}/>;
            case 'Discount Codes':
                return <DiscountCodes navigation={navigation} openInventory={handleItemClick}/>;
            case 'Tax Codes':
                return <Taxcodes navigation={navigation} openInventory={handleItemClick}/>;
            case 'Color Combinations':
                return <Colorcombinations navigation={navigation} openInventory={handleItemClick}/>;
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
            screenName={"Settings"}
        >
            <ScrollView>
                <View style={styles.container}>
                    <TouchNavGroup sectionTitle="Settings" items={[
                        { title: "Manufactures", icon: 'industry' },
                        { title: "Tag Management", icon: 'tags' },
                        { title: "Locations", icon: 'map-marker-alt' },
                        { title: "Document Management", icon: 'sticky-note' },
                        { title: "Reservation Types", icon: 'calendar-check' },
                        { title: "Trucks", icon: 'truck' },
                        // { title: "Store Details", icon: 'store' },
                        { title: "Discount Codes", icon: 'check' },
                        { title: "Tax Codes", icon: 'check' },
                        { title: "Color Combinations", icon: 'check' },
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
        marginTop: 80,
    },
});

export default Settings;
