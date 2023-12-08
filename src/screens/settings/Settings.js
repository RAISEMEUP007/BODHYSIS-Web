import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import TouchNavGroup from '../../common/components/navpanel/TouchNavGroup';
import Manufactures from './manufactures/Manufactures';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import Tags from './tags/Tags';

import { ScrollView } from 'react-native-gesture-handler';

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
            default:
                return (
                    <View style={{ flexs: 1, border:'1px solid #d54545', marginRights: 20, paddingHorizontal: 10, paddingVertical:2, marginTop: 8, height: 28, justifyContent: 'center', flexDirection: 'row', marginTop: 100, }}>
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
                        { title: "Manufactures", icon: 'check'  },
                        { title: "Tag Management", icon: 'check'  },
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
