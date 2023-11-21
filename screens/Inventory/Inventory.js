import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PriceGroup from './PriceGroup';

const Inventory = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    
    const handleItemClick = (itemName) => {
        setSelectedItem(itemName);
    };
    
    if(selectedItem) {
        switch (selectedItem) {
        case 'Price groups':
            return <PriceGroup/>;
        default:
            return (
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginTop: 100, }}>
                    <TouchableOpacity  style={{ border:'1px solid gray', marginRight: '20px', paddingHorizontal: 10, paddingVertical:2, marginTop: 8, height: 28, }} onPress={() => handleItemClick(null)}>
                        <Text>{'<'}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: '28px' }}>{selectedItem}</Text>
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>General</Text>
                <View style={styles.containerRow}>
                    <TouchableOpacity style={styles.item} onPress={() => handleItemClick("Add/manage items")}>
                        <Text>Add/manage items</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => handleItemClick("Search")}>
                        <Text>Search</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Price Management</Text>
                <View style={styles.containerRow}>
                    <TouchableOpacity style={styles.item} onPress={() => handleItemClick("Price groups")}>
                        <Text>Price groups</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Bulk Update</Text>
                <View style={styles.containerRow}>
                    <TouchableOpacity style={styles.item} onPress={() => handleItemClick("Bulk Update")}>
                        <Text>Bulk Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Print</Text>
                <View style={styles.containerRow}>
                    <TouchableOpacity style={styles.item} onPress={() => handleItemClick("Print snapshot")}>
                        <Text>Print snapshot</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '80%',
        maxWidth: '800px',
        margin: 'auto',
        marginTop: '80px',
    },
    section: {
        marginBottom: 40,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    containerRow: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    item: {
        flexBasis: "40%",
        padding: 10,
        backgroundColor: 'white',
        border: '1px solid gray',
        marginTop: "2.5%",
        marginHorizontal: "5%",
        marginBottom: 5,
    },
});

export default Inventory;
