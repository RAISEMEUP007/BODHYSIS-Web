import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import CommonInput from '../../../common/components/input/CommonInput';
import { CommonButton } from '../../../common/components/CommonButton/CommonButton';
import { Colors } from '../../../common/constants/Colors';

interface ProductSelection {
  name: string;
  quantity: number;
  index: number;
}

export const EquipmentDropdown = () => {
  const [productsToRender, setProductsToRender] = useState<Array<ProductSelection>>([
    {
      name: '',
      quantity: 0,
      index: 0,
    },
  ]);

  const createNewItem = useCallback(() => {
    const result: Array<ProductSelection> = [...productsToRender];
    result.push({
      name: '',
      quantity: 0,
      index: currentIndex + 1,
    });

    setProductsToRender(result);
    setCurrentIndex(currentIndex + 1);
  }, [productsToRender]);

  const deleteItem = useCallback(
    (index: number) => {
      const result = [...productsToRender];
      result.splice(index, 1);
      setProductsToRender(result);
    },
    [productsToRender]
  );

  const [equipmentValues, setEquipmentValues] = useState<Record<number, ProductSelection>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.container}>
        <View style={styles.leftColumnContainer}>
          <Text style={styles.index}>{index + 1}</Text>
        </View>
        <View style={styles.productNameContainer}>
          <CommonInput />
        </View>
        <View style={styles.quantityContainer}>
          <CommonInput containerStyle={{ marginTop: 20 }} width={60} />
        </View>
        <View style={styles.deleteContainer}>
          <CommonButton
            backgroundColor={Colors.Secondary.MAROON}
            label={'Delete'}
            type={'rounded'}
            onPress={() => {
              deleteItem(index);
            }}
            containerStyle={{ marginBottom: 5 }}
          />
        </View>
      </View>
    );
  };

  const topContainerHeight = 20;
  return (
    <View style={styles.outterContainer}>
      <View style={styles.topContainer}>
        <View style={styles.leftColumnContainer} />
        <View style={{ ...styles.productNameContainer, height: topContainerHeight }}>
          <Text>{'Product Name'}</Text>
        </View>
        <View style={{ ...styles.quantityContainer, height: topContainerHeight }}>
          <Text>{'Quantity'}</Text>
        </View>
        <View style={{ ...styles.deleteContainer, height: topContainerHeight }}></View>
      </View>
      <FlatList renderItem={renderItem} data={productsToRender} />
      <CommonButton type={'rounded'} onPress={createNewItem} label={'New Item'} />
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
  },
  outterContainer: {
    flexDirection: 'column',
    marginVertical: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  leftColumnContainer: {
    width: 100,
    alignItems: 'center',
  },
  productNameContainer: {
    height: 40,
    width: 400,
    alignItems: 'center',
  },
  index: {
    marginBottom: 2,
  },
  quantityContainer: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  deleteContainer: {
    width: 180,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 40,
  },
});
