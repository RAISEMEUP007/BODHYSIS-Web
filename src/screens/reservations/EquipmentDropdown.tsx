import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Modal, Pressable, ScrollView, TextInput } from 'react-native';
import CommonInput from '../../common/components/input/CommonInput';
import { CommonButton } from '../../common/components/CommonButton/CommonButton';
import { Colors } from '../../common/constants/Colors';
import { ProductResponseType, ProductType } from '../../types/ProductTypes';
import {
  CommonDropdown,
  DropdownData,
} from '../../common/components/CommonDropdown/CommonDropdown';
import { PriceTableHeaderDataResponseType } from '../../types/PriceTableTypes';

export interface ProductSelection {
  name: string;
  quantity: number;
  index: number;
  value: ProductType | null;
}

type EquipmentMap = Record<number, ProductSelection>;

interface Props {
  onChange: (data: Array<ProductSelection>) => void;
  products: ProductResponseType;
  // headerData: PriceTableHeaderDataResponseType;
}

export const EquipmentDropdown = ({ onChange, products }: Props) => {
  const [dataMap, setDataMap] = useState<EquipmentMap>({});
  const [showModal, setShowModal] = useState(false);
  const [quantities, setQuantities] = useState<Array<string>>([]);

  const productsDropdownData = useMemo(() => {
    if (!products.length) {
      return [];
    }

    const result: DropdownData<ProductType> = products.map((item, index) => {
      return {
        value: item,
        displayLabel: `${item.line}`,
        secondaryLabel: `family - ${item.family.family}\n line - ${item.line}`,
        index,
      };
    });
    return result;
  }, [products]);

  const data = useMemo(() => {
    return Object.values(dataMap);
  }, [dataMap]);

  useEffect(() => {
    onChange(data);
  }, [data]);

  const [productsToRender, setProductsToRender] = useState<Array<ProductSelection>>([
    {
      name: null,
      quantity: 1,
      index: 0,
      value: null,
    },
  ]);

  const createNewItem = useCallback(() => {
    const result: Array<ProductSelection> = [...productsToRender];
    result.push({
      name: null,
      quantity: 1,
      index: currentIndex + 1,
      value: null,
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.container}>
        <View style={styles.leftColumnContainer}>
          <Text style={styles.index}>{index + 1}</Text>
        </View>
        <View style={styles.productNameContainer}>
          <Pressable
            onPress={() => {
              setShowModal(true);
              setCurrentIndex(index);
            }}
            style={styles.selectButton}
          >
            <Text style={{color:(dataMap[index]?.name ? 'black' : '#bfbfbf')}}>{dataMap[index]?.name ? dataMap[index].name : 'Select A Product Line'}</Text>
          </Pressable>
        </View>
        <View style={styles.quantityContainer}>
          <TextInput
            placeholder="Enter"
            defaultValue={quantities[index]}
            onChangeText={(value) => {
              const newQuantities = [...quantities];
              newQuantities[index] = value;
              setQuantities(newQuantities);

              const map = { ...dataMap };
              if (!map[index]) {
                map[index] = {
                  name: null,
                  index: index,
                  quantity: 1,
                  value: null,
                };
              }
              
              const parsedValue = parseInt(value, 10);
              if (!isNaN(parsedValue) && parsedValue > 0) {
                map[index].quantity = parsedValue;
              } else {
                map[index].quantity = 1;
              }

              setDataMap(map);
            }}
            style={{textAlign:'right', width:70, borderWidth:1, borderColor: '#808080', padding:8}}
          />
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

  const renderModal = () => {
    return (
      <Modal visible={showModal}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{'Select A Product Line'}</Text>
          <ScrollView style={styles.modalScroll}>
            <CommonDropdown
              textAlign={'left'}
              onItemSelected={(item) => {
                const map = { ...dataMap };
                if (!map[currentIndex]) {
                  map[currentIndex] = {
                    name: item.displayLabel,
                    index: currentIndex,
                    quantity: 0,
                    value: item.value,
                  };
                  setShowModal(false);
                } else {
                  map[currentIndex].name = item.displayLabel;
                  map[currentIndex].value = item.value;
                  setShowModal(false);
                }
                setDataMap(map);
              }}
              width={400}
              placeholder="Select"
              data={productsDropdownData}
            />
          </ScrollView>
        </View>
      </Modal>
    );
  };

  // const topContainerHeight = 20;
  return (
    <View style={styles.outterContainer}>
      <View style={styles.topContainer}>
        <View style={styles.leftColumnContainer} />
        <View style={{ ...styles.productNameContainer}}>
          <Text>{'Product Name'}</Text>
        </View>
        <View style={{ ...styles.quantityContainer}}>
          <Text>{'Quantity'}</Text>
        </View>
        <View style={{ ...styles.deleteContainer}}></View>
      </View>
      <FlatList renderItem={renderItem} data={productsToRender} />
      <View style={{marginTop:20}}>
        <CommonButton type={'rounded'} onPress={createNewItem} label={'New Item'} />
      </View>
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  outterContainer: {
    flexDirection: 'column',
    marginVertical: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  leftColumnContainer: {
    width: 50,
    alignItems: 'center',
  },
  productNameContainer: {
    alignItems: 'flex-start',
    width: 400,
  },
  index: {
  },
  quantityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal:40,
  },
  deleteContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  selectButton: {
    width: 400,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#808080',
  },
  modal: {
    padding: 20,
    flex: 1,
    backgroundColor: Colors.Neutrals.LIGHT_GRAY,
    alignItems: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
  },
});
