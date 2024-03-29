import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';

import {
  getProductsData,
  deleteProduct,
  getProductCategoriesData,
  getProductFamiliesData,
  getProductLinesData,
} from '../../../../api/Product';
import { getLocationsData } from '../../../../api/Settings';
import { msgStr } from '../../../../common/constants/Message';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal } from '../../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../../common/components/CustomLayout/BasicLayout';

import { productsStyle } from './styles/ProductsStyle';
import AddProductModal from './AddProductModal';
import QuickAddProductModal from './QuickAddProductModal';

const Products = ({ navigation, openInventory, data }) => {
  const initialMount = useRef(true);
  const screenHeight = Dimensions.get('window').height;
  const StatusObj = {
    0: 'Ready',
    1: 'Ordered',
    2: 'Checked out',
    // 3: 'Checked in',
    4: 'Broken',
    5: 'Sold',
    6: 'Transferred',
  };

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateProductTrigger, setUpdateProductsTrigger] = useState(false);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isQuickAddModalVisible, setQuickAddModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openAddProductModal = () => {
    setAddModalVisible(true);
    setSelectedProduct(null);
  };
  const closeAddProductModal = () => {
    setAddModalVisible(false);
    setSelectedProduct(null);
  };
  const editProduct = (item) => {
    setSelectedProduct(item);
    setAddModalVisible(true);
  };

  const openQuickAddProductModal = () => {
    setQuickAddModalVisible(true);
    setSelectedProduct(null);
  };
  const closeQuickAddProductModal = () => {
    setQuickAddModalVisible(false);
    setSelectedProduct(null);
  };

  const [searchCategory, setSearchCategory] = useState(0);
  const [searchFamily, setSearchFamily] = useState(0);
  const [searchProductLine, setSearchProductLine] = useState(0);
  const [searchProduct, setSearchProduct] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');
  const [searchSize, setSearchSize] = useState('');
  const [searchLocation, setSearchLocation] = useState(0);

  const [categories, setCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [lines, setLines] = useState([]);
  const [Locations, setLocations] = useState([]);

  useEffect(() => {
    if (data == null && updateProductTrigger == true) {
      getTable();
    }
  }, [updateProductTrigger]);

  useEffect(() => {
    if (initialMount.current == false) {
      let timeoutId = setTimeout(() => {
        getTable();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [searchCategory, searchFamily, searchProductLine]);

  useEffect(() => {
    if (initialMount.current == false) {
      if (searchCategory != 0) {
        loadProductFamiliesData(searchCategory, (jsonRes) => {
          setFamilies(jsonRes);
          if (jsonRes.length > 0) setSearchFamily(jsonRes[0].id);
          else {
            setSearchFamily(0);
          }
        });
      } else {
        setFamilies([]);
        setSearchFamily(0);
      }
    }
  }, [searchCategory]);

  useEffect(() => {
    if (initialMount.current == false) {
      if (searchFamily != 0) {
        loadProductLinesData(searchFamily, (jsonRes) => {
          setLines(jsonRes);
          if (jsonRes.length > 0) setSearchProductLine(jsonRes[0].id);
          else {
            setSearchProductLine(0);
          }
        });
      } else {
        setLines([]);
        setSearchProductLine(0);
      }
    }
  }, [searchFamily]);

  useEffect(() => {
    if (data)
      if (data.searchOptions) {
        setTimeout(() => {
          if (data.searchOptions.categoryId) setSearchCategory(data.searchOptions.categoryId);
          setTimeout(() => {
            if (data.searchOptions.familyId) setSearchFamily(data.searchOptions.familyId);
            setTimeout(() => {
              if (data.searchOptions.lineId) setSearchProductLine(data.searchOptions.lineId);
              data = null;
            }, 50);
          }, 50);
        }, 50);
      }
  }, [data]);

  useEffect(() => {
    loadProductCategoriesData((categories) => {
      const categoryId = categories[0] ? categories[0].id : null;
      loadProductFamiliesData(categoryId, (families) => {
        const familyId = families[0] ? families[0].id : null;
        loadProductLinesData(familyId, (lines) => {
          if (categories.length) {
            setCategories(categories);
            // setSearchCategory(categories[0].id);
          } else setCategories([]);

          if (families.length) {
            setFamilies(families);
            // setSearchFamily(families[0].id);
          } else setFamilies([]);

          if (lines.length) {
            setLines(lines);
            // setSearchProductLine(lines[0].id);
          } else setLines([]);

          setUpdateProductsTrigger(true);
          initialMount.current = false;
        });
      });
    });
    getLocationsData((jsonRes, status, error) => {
      if (status == 200) setLocations(jsonRes);
    });
  }, []);

  const loadProductCategoriesData = (callback) => {
    getProductCategoriesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          callback(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const loadProductFamiliesData = (categoryId, callback) => {
    getProductFamiliesData(categoryId, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          callback(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const loadProductLinesData = (familyId, callback) => {
    getProductLinesData(familyId, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          callback(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const removeProduct = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteProduct(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateProductsTrigger(true);
            showAlert('success', jsonRes.message);
            break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      });
    });
  };

  const getTable = () => {
    console.log('loadTable');
    const CFLOption = {
      category_id: searchCategory,
      family_id: searchFamily,
      line_id: searchProductLine,
    };

    getProductsData(CFLOption, (jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateProductsTrigger(false);
          setTableData(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    });
  };

  const renderTableData = () => {
    const filteredData = tableData.filter((item) => {
      const isProductMatch = searchProduct.trim()
        ? item.product.toLowerCase().includes(searchProduct.trim().toLowerCase())
        : true;
      const isBarcodeMatch = searchBarcode.trim()
        ? item.barcode && item.barcode.toLowerCase().includes(searchBarcode.trim().toLowerCase())
        : true;
      const isSizeMatch = searchSize.trim()
        ? item.line && item.line.size.toLowerCase().includes(searchSize.trim().toLowerCase())
        : true;
      const isLocationMatch =
        searchLocation != 0
          ? (item.home_location && item.home_location == searchLocation) ||
            (item.current_location && item.current_location == searchLocation)
          : true;

      return isProductMatch && isBarcodeMatch && isSizeMatch && isLocationMatch;
    });

    const rows = [];
    if (filteredData.length > 0) {
      filteredData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, styles.categoryCell]}>
              <Text style={styles.categoryCell}>{item.product}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.category ? item.category.category : ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.family ? (item.family.family) : ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.line ? item.line.line : ''}</Text>
            </View>
            <View style={[styles.cell, { width: 100 }]}>
              <Text>{item.line ? item.line.size : ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.barcode ? item.barcode : ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.serial_number ? item.serial_number : ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>
                {item.home_location_tbl ? item.home_location_tbl.location : ''}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>
                {item.current_location_tbl ? item.current_location_tbl.location : ''}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cell}>{item.status ? StatusObj[item.status] : ''}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editProduct(item);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeProduct(item.id);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
    } else {
      <></>;
    }
    return <>{rows}</>;
  };

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        openInventory(data?.searchOptions ? 'Product Lines' : null);
      }}
      screenName={'Products'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Category</Text>
              <Picker
                style={[styles.searchInput, styles.searchPicker]}
                selectedValue={searchCategory}
                onValueChange={setSearchCategory}
              >
                <Picker.Item label={''} value={0} />
                {categories.length > 0 &&
                  categories.map((category, index) => {
                    return (
                      <Picker.Item key={index} label={category.category} value={category.id} />
                    );
                  })}
              </Picker>
            </View>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Family</Text>
              <Picker
                style={[styles.searchInput, styles.searchPicker]}
                selectedValue={searchFamily}
                onValueChange={setSearchFamily}
              >
                <Picker.Item label={''} value={0} />
                {families.length > 0 &&
                  families.map((family, index) => {
                    return <Picker.Item key={index} label={(family.family)} value={family.id} />;
                  })}
              </Picker>
            </View>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Line</Text>
              <Picker
                style={[styles.searchInput, styles.searchPicker]}
                selectedValue={searchProductLine}
                onValueChange={setSearchProductLine}
              >
                <Picker.Item label={''} value={0} />
                {lines.length > 0 &&
                  lines.map((line, index) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={line.line + ' ' + line.size}
                        value={line.id}
                      />
                    );
                  })}
              </Picker>
            </View>
          </View>
          <View style={styles.toolbar}>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Product</Text>
              <TextInput
                style={styles.searchInput}
                placeholder=""
                value={searchProduct}
                onChangeText={setSearchProduct}
              />
            </View>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Size</Text>
              <TextInput
                style={styles.searchInput}
                placeholder=""
                value={searchSize}
                onChangeText={setSearchSize}
              />
            </View>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Barcode</Text>
              <TextInput
                style={styles.searchInput}
                placeholder=""
                value={searchBarcode}
                onChangeText={setSearchBarcode}
              />
            </View>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Location</Text>
              <Picker
                style={[styles.searchInput]}
                selectedValue={searchLocation}
                onValueChange={setSearchLocation}
              >
                <Picker.Item label={''} value={0} />
                {Locations.length > 0 &&
                  Locations.map((location, index) => {
                    return (
                      <Picker.Item key={index} label={location.location} value={location.id} />
                    );
                  })}
              </Picker>
            </View>
          </View>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddProductModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={openQuickAddProductModal}>
              <Text style={styles.buttonText}>Quick Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, { width: 250 }]}>{'Product'}</Text>
              <Text style={[styles.columnHeader]}>{'Category'}</Text>
              <Text style={[styles.columnHeader]}>{'Family'}</Text>
              <Text style={[styles.columnHeader]}>{'Line'}</Text>
              <Text style={[styles.columnHeader, { width: 100 }]}>{'Size'}</Text>
              <Text style={[styles.columnHeader]}>{'Barcode'}</Text>
              <Text style={[styles.columnHeader]}>{'Serial Number'}</Text>
              <Text style={[styles.columnHeader]}>{'Home Location'}</Text>
              <Text style={[styles.columnHeader]}>{'Current Location'}</Text>
              <Text style={[styles.columnHeader]}>{'Status'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 350 }}>
              {renderTableData()}
            </ScrollView>
          </View>

          <AddProductModal
            isModalVisible={isAddModalVisible}
            Product={selectedProduct}
            setUpdateProductsTrigger={setUpdateProductsTrigger}
            closeModal={closeAddProductModal}
          />
          <QuickAddProductModal
            isModalVisible={isQuickAddModalVisible}
            setUpdateProductsTrigger={setUpdateProductsTrigger}
            closeModal={closeQuickAddProductModal}
          />
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = productsStyle;

export default Products;
