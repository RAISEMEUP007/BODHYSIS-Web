import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Modal, Pressable, ScrollView } from 'react-native';
import CommonInput from '../../../common/components/input/CommonInput';
import { CommonButton } from '../../../common/components/CommonButton/CommonButton';
import { Colors } from '../../../common/constants/Colors';
import { ProductResponseType, ProductType } from '../../../types/ProductTypes';
import {
  CommonDropdown,
  DropdownData,
} from '../../../common/components/CommonDropdown/CommonDropdown';

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
}

export const EquipmentDropdown = ({ onChange, products }: Props) => {
  const [dataMap, setDataMap] = useState<EquipmentMap>({});
  const [showModal, setShowModal] = useState(false);

  const productsDropdownData = useMemo(() => {
    if (!products.length) {
      return [];
    }

    const result: DropdownData<ProductType> = products.map((item, index) => {
      return {
        value: item,
        displayLabel: item.product,
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
      name: '',
      quantity: 0,
      index: 0,
      value: null,
    },
  ]);

  const createNewItem = useCallback(() => {
    const result: Array<ProductSelection> = [...productsToRender];
    result.push({
      name: '',
      quantity: 0,
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
            <Text>{dataMap[index] ? dataMap[index].name : 'Select A Product'}</Text>
          </Pressable>
        </View>
        <View style={styles.quantityContainer}>
          <CommonInput
            onChangeText={(value) => {
              const map = { ...dataMap };
              if (!map[index]) {
                map[index] = {
                  name: '',
                  index: index,
                  quantity: 0,
                  value: null,
                };
              } else {
                map[index].quantity = value;
              }
              setDataMap(map);
            }}
            containerStyle={{ marginTop: 20 }}
            width={60}
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
          <Text style={styles.modalTitle}>{'Select A Product'}</Text>
          <ScrollView style={styles.modalScroll}>
            <CommonDropdown
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
                  setShowModal(false);
                }
                setDataMap(map);
              }}
              width={250}
              placeholder="Select"
              data={productsDropdownData}
            />
          </ScrollView>
        </View>
      </Modal>
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
    minHeight: 100,
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
  selectButton: {
    width: 240,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.Neutrals.LIGHT_GRAY,
  },
  modal: {
    padding: 20,
    flex: 1,
  },
  modalScroll: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});
