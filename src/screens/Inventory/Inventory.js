import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import TouchNavGroup from '../../common/components/navpanel/TouchNavGroup';

import PriceTables from './pricetables/PriceTables';
import PriceLogic from './pricelogic/PriceLogic';
import Seasons from './seasons/Seasons';
import Brands from './brands/Brands';
import Products from './product/products/Products';
import ProductCategories from './product/productcategories/ProductCategories';
import ProductFamilies from './product/productfamilies/ProductFamilies';
import ProductLines from './product/productlines/ProductLines';
import { ScrollView } from 'react-native-gesture-handler';

const Inventory = ({initalItem = null}) => {
    const [selectedItem, setSelectedItem] = useState(initalItem);
    
    const handleItemClick = (itemName) => {
        setSelectedItem(itemName);
    };
    
    if(selectedItem) {
        switch (selectedItem) {
            case 'Products':
                return <Products/>;
            case 'Product Categories':
                return <ProductCategories/>;
            case 'Product Families':
                return <ProductFamilies/>;
            case 'Product Lines':
                return <ProductLines/>;
            case 'Price Tables':
                return <PriceTables/>;
            case 'Price Logic':
                return <PriceLogic/>;
            case 'Seasons':
                return <Seasons/>;
            case 'Brands':
                return <Brands/>;
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
        <View style={styles.container}>
            <ScrollView>
                <TouchNavGroup sectionTitle="General" items={[
                    { title: "Products", icon: 'check'  },
                    { title: "Product Categories", icon: 'check' },
                    { title: "Product Families", icon: 'check'  },
                    { title: "Product Lines", icon: 'check'  },
                    { title: "Search", icon: 'search'  }
                ]} handleItemClick={handleItemClick} />
                <TouchNavGroup sectionTitle="Price Management" items={[
                    { title: "Price Tables",  icon: 'table'  },
                    { title: "Price Logic",  icon: 'table'  },
                    { title: "Seasons", icon: 'tree'  },
                    { title: "Brands",  icon: 'tags' }
                ]} handleItemClick={handleItemClick} />
                <TouchNavGroup sectionTitle="Bulk Update" items={[
                    { title: "Bulk Update", icon: 'wrench' }
                ]} handleItemClick={handleItemClick} />
                <TouchNavGroup sectionTitle="Print" items={[
                    { title: "Print Snapshot", icon: 'print'  }
                ]} handleItemClick={handleItemClick} />
            </ScrollView>
        </View>
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

export default Inventory;
