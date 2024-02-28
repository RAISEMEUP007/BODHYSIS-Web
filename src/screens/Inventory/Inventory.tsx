import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import TouchNavGroup from '../../common/components/navpanel/TouchNavGroup';

import PriceTables from './price/pricetables/PriceTables';
import PriceLogic from './price/pricelogic/PriceLogic';
import Seasons from './seasons/Seasons';
import Brands from './price/brands/Brands';
import Products from './product/products/Products';
import ProductCategories from './product/productcategories/ProductCategories';
import ProductFamilies from './product/productfamilies/ProductFamilies';
import ProductLines from './product/productlines/ProductLines';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import PriceGroupLists from './price/pricegrouplist/PriceGroupList';

const Inventory = ({ navigation, initalItem = null }) => {
  const [selectedItem, setSelectedItem] = useState(initalItem);
  const [data, setData] = useState(null);

  const handleItemClick = (itemName, data) => {
    setSelectedItem(itemName);
    setData(data);
  };

  if (selectedItem) {
    switch (selectedItem) {
      case 'Products':
        return <Products navigation={navigation} openInventory={handleItemClick} data={data} />;
      case 'Product Categories':
        return <ProductCategories navigation={navigation} openInventory={handleItemClick} />;
      case 'Product Families':
        return <ProductFamilies navigation={navigation} openInventory={handleItemClick} />;
      case 'Product Lines':
        return <ProductLines navigation={navigation} openInventory={handleItemClick} />;
      case 'Price Tables':
        return <PriceTables navigation={navigation} openInventory={handleItemClick} />;
      case 'Price Logic':
        return <PriceLogic navigation={navigation} openInventory={handleItemClick} />;
      case 'Price Group':
        return <PriceGroupLists navigation={navigation} openInventory={handleItemClick} />;
      case 'Seasons':
        return <Seasons navigation={navigation} openInventory={handleItemClick} />;
      case 'Brands':
        return <Brands navigation={navigation} openInventory={handleItemClick} />;
      default:
        return (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#d54545',
              paddingHorizontal: 10,
              paddingVertical: 2,
              height: 28,
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 100,
            }}
          >
            <TouchableOpacity onPress={() => handleItemClick(null, null)}>
              <Text>{'< Back'}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 28 }}>{selectedItem}</Text>
          </View>
        );
    }
  }

  return (
    <BasicLayout navigation={navigation} screenName={'Inventory'}>
      <ScrollView>
        <View style={styles.container}>
          <TouchNavGroup
            sectionTitle="General"
            items={[
              { title: 'Products', icon: 'check' },
              { title: 'Product Categories', icon: 'check' },
              { title: 'Product Families', icon: 'check' },
              { title: 'Product Lines', icon: 'check' },
              { title: 'Search', icon: 'search' },
            ]}
            handleItemClick={handleItemClick}
          />
          <TouchNavGroup
            sectionTitle="Price Management"
            items={[
              { title: 'Price Tables', icon: 'table' },
              { title: 'Price Logic', icon: 'funnel-dollar' },
              { title: 'Price Group', icon: 'coins' },
              { title: 'Seasons', icon: 'tree' },
              { title: 'Brands', icon: 'tags' },
            ]}
            handleItemClick={handleItemClick}
          />
          <TouchNavGroup
            sectionTitle="Bulk Update"
            items={[{ title: 'Bulk Update', icon: 'wrench' }]}
            handleItemClick={handleItemClick}
          />
          <TouchNavGroup
            sectionTitle="Print"
            items={[{ title: 'Print Snapshot', icon: 'print' }]}
            handleItemClick={handleItemClick}
          />
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

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

export default Inventory;
