import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator } from 'react-native-paper';
import Checkbox from 'expo-checkbox';
import { FontAwesome5 } from '@expo/vector-icons';

import {
  getProductsData,
  deleteProduct,
  getProductCategoriesData,
  getProductFamiliesData,
  getProductLinesData,
} from '../../../../api/Product';
import { getLocationsData, updateLocation } from '../../../../api/Settings';
import { msgStr } from '../../../../common/constants/Message';
import { TextMediumSize } from '../../../../common/constants/Fonts';
import { useAlertModal, useConfirmModal } from '../../../../common/hooks';
import BasicLayout from '../../../../common/components/CustomLayout/BasicLayout';

import { productsStyle } from './styles/ProductsStyle';
import AddProductModal from './AddProductModal';
import QuickAddProductModal from './QuickAddProductModal';
import BulkUpdateLocationModal from './BulkUpdateLocationModal';
import BulkUpdateStatus from './BulkUpdateStatus';

const Products = ({ navigation, openInventory, data }) => {
  const initialMount = useRef(true);
  const StatusObj = {
    0: 'Ready',
    1: 'Ordered',
    2: 'Checked out',
    3: 'Checked in',
    4: 'Broken',
    5: 'Sold',
    6: 'Transferred',
  };

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateProductTrigger, setUpdateProductsTrigger] = useState(false);
  const [checkedItemIds, setCheckedItemIds] = useState([]);
  const [isCheckedAll, setIsCheckAll] = useState(false);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isQuickAddModalVisible, setQuickAddModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isBulkUpdateLocationVisible, setBulkUpdateLocationVisible] = useState(false);
  const [isBulkUpdateStatusVisible, setBulkUpdateStatusVisible] = useState(false);

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

  const bulkUpdateLocation = () => { setBulkUpdateLocationVisible(true); }
  const closeBulkUpdateLocation = () => { setBulkUpdateLocationVisible(false); }

  const blukUPdateStatus = () => { setBulkUpdateStatusVisible(true); }
  const closeBlukUPdateStatus = () => { setBulkUpdateStatusVisible(false); }

  const [searchCategory, setSearchCategory] = useState(0);
  const [searchFamily, setSearchFamily] = useState(0);
  const [searchProductLine, setSearchProductLine] = useState(0);
  const [searchBarcode, setSearchBarcode] = useState('');
  const [searchSize, setSearchSize] = useState('');
  const [searchLocation, setSearchLocation] = useState(0);

  const [categories, setCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [lines, setLines] = useState([]);
  const [Locations, setLocations] = useState([]);

  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(false);

  const getSortedData = (tableData) => {
    if(sortColumn && sortDirection){
      tableData.sort((a, b) => {
        let A; let B;
        if(sortColumn == 'category'){
          A = a.category.category;  B = b.category.category;
        }else if(sortColumn == 'family'){
          A = a.family.family; B = b.family.family;
        }else if(sortColumn == 'line'){
          A = a.line.line; B = b.line.line;
        }else if(sortColumn == 'size'){
          A = a.line.size; B = b.line.size;
        }else if(sortColumn == 'home_location'){
          A = a.home_location_tbl.location; B = b.home_location_tbl.location;
        }else if(sortColumn == 'current_location'){
          A = a.current_location_tbl.location; B = b.current_location_tbl.location;
        }else{
          A = a[sortColumn];
          B = b[sortColumn];
        }

        if (typeof A === 'number' && typeof B === 'number') {
          return sortDirection === 'asc' ? A - B : B - A;
        } else {
          const textA = String(A).toUpperCase();
          const textB = String(B).toUpperCase();
          return sortDirection === 'asc' ? textA.localeCompare(textB) : textB.localeCompare(textA);
        }
      });

      return tableData;
    }else return tableData;
  }

  const filteredAndSortedData = useMemo(()=>{
    const filteredData = tableData.filter((item) => {
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

      return isBarcodeMatch && isSizeMatch && isLocationMatch;
    });

    return getSortedData(filteredData);

  }, [tableData, searchBarcode, searchSize, searchLocation, sortColumn, sortDirection]);

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
    const CFLOption = {
      category_id: searchCategory,
      family_id: searchFamily,
      line_id: searchProductLine,
    };

    setIsLoading(true);
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

  const setIsChecked = (itemId, value) => {
    setIsLoading(true);
    setCheckedItemIds((prevIds) => {
      if (value) {
        return [...prevIds, itemId];
      } else {
        return prevIds.filter((id) => id !== itemId);
      }
    });
  }

  const blukDelete = () => {
    if(!checkedItemIds || !Array.isArray(checkedItemIds) || checkedItemIds.length == 0){
      showAlert('warning', 'Please select products');
      return;
    }
    deleteProduct(checkedItemIds, (jsonRes)=>{
      showAlert('success', jsonRes.message);
      setUpdateProductsTrigger(true);
    })
  }

  const updateCheckedAll = (value) => {
    setIsLoading(true);
    const updatedCheckedItemIds = value ? filteredAndSortedData.map((item) => item.id) : [];
    setCheckedItemIds(updatedCheckedItemIds);
    setIsCheckAll(value);
  }

  const sortData = (column) =>{
    setIsLoading(true);
    const direction = column === sortColumn && sortDirection === 'desc' ? 'asc' : 'desc';

    setSortColumn(column);
    setSortDirection(direction);
  }

  const renderTableData = () => {
    const rows = [];
    if (filteredAndSortedData.length > 0) {
      filteredAndSortedData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, {width:50, alignItems:"center", justifyContent:'center', padding:0}]}>
              <Checkbox 
                value={checkedItemIds.includes(item.id)}
                onValueChange={(value)=>setIsChecked(item.id, value)}/>
            </View>
            <View style={styles.cell}>
              <Text>{item.category ? item.category.category : ''}</Text>
            </View>
            <View style={[styles.cell, { width: 200 }]}>
              <Text>{item.family ? (item.family.family) : ''}</Text>
            </View>
            <View style={[styles.cell, {width:200}]}>
              <Text>{item.line ? item.line.line : ''}</Text>
            </View>
            <View style={[styles.cell, { width: 80 }]}>
              <Text>{item.line ? item.line.size : ''}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{item.barcode ? item.barcode : ''}</Text>
            </View>
            {/* <View style={styles.cell}>
              <Text>{item.serial_number ? item.serial_number : ''}</Text>
            </View> */}
            <View style={styles.cell}>
              <Text>
                {item.home_location_tbl ? item.home_location_tbl.location : ''}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                {item.current_location_tbl ? item.current_location_tbl.location : ''}
              </Text>
            </View>
            <View style={[styles.cell, { width: 110 }]}>
              <Text>{item.status != null ? StatusObj[item.status] : ''}</Text>
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
    setIsLoading(false);
    return <>{rows}</>;
  };

  const buttonsElement = useMemo(()=>(<View style={styles.toolbar}>
    <TouchableHighlight style={styles.button} onPress={openAddProductModal}>
      <Text style={styles.buttonText}>Add</Text>
    </TouchableHighlight>
    <TouchableHighlight style={styles.button} onPress={openQuickAddProductModal}>
      <Text style={styles.buttonText}>Quick Add</Text>
    </TouchableHighlight>
    <Text style={{marginLeft:50, marginRight:5}}>Bulk Actions</Text>
    <TouchableHighlight style={styles.bulkbutton} onPress={bulkUpdateLocation}>
      <Text style={styles.buttonText}>Update Location</Text>
    </TouchableHighlight>
    <TouchableHighlight style={styles.bulkbutton} onPress={blukUPdateStatus}>
      <Text style={styles.buttonText}>Update Status</Text>
    </TouchableHighlight>
    <TouchableHighlight style={styles.bulkbutton} onPress={blukDelete}>
      <Text style={styles.buttonText}>Delete</Text>
    </TouchableHighlight>
  </View>), []);

  const tableElement = useMemo(()=>(<View style={styles.tableContainer}>
    <View style={styles.tableHeader}>
      <View style={[styles.columnHeader, {width:50, alignItems:"center", justifyContent:'center', padding:0}]}>
        <Checkbox value={isCheckedAll} onValueChange={updateCheckedAll}/>
      </View>
      <Pressable style={[styles.columnHeader, styles.sortableColumn]} onPress={()=>sortData('category')}>
        <Text>{'Category'}</Text>
        {sortColumn == 'category' && sortDirection == 'desc'?
          <FontAwesome5 name={"sort-amount-up-alt"} style={{}} />
          : <FontAwesome5 name={"sort-amount-down-alt"} style={{}} />
        }
      </Pressable>
      <Pressable style={[styles.columnHeader, styles.sortableColumn, { width: 200 }]} onPress={()=>sortData('family')}>
        <Text>{'Family'}</Text>
        {sortColumn == 'family' && sortDirection == 'desc'?
          <FontAwesome5 name={"sort-amount-up-alt"} style={{}} />
          : <FontAwesome5 name={"sort-amount-down-alt"} style={{}} />
        }
      </Pressable>
      <Pressable style={[styles.columnHeader, styles.sortableColumn, {width:200}]} onPress={()=>sortData('line')}>
        <Text>{'Line'}</Text>
        {sortColumn == 'line' && sortDirection == 'desc'?
          <FontAwesome5 name={"sort-amount-up-alt"} style={{}} />
          : <FontAwesome5 name={"sort-amount-down-alt"} style={{}} />
        }
      </Pressable>
      <Pressable style={[styles.columnHeader, styles.sortableColumn, { width: 80 }]} onPress={()=>sortData('size')}>
        <Text>{'Size'}</Text>
        {sortColumn == 'size' && sortDirection == 'desc'?
          <FontAwesome5 name={"sort-amount-up-alt"} style={{}} />
          : <FontAwesome5 name={"sort-amount-down-alt"} style={{}} />
        }
      </Pressable>
      <Pressable style={[styles.columnHeader, styles.sortableColumn]} onPress={()=>sortData('barcode')}>
        <Text>{'Barcode'}</Text>
        {sortColumn == 'barcode' && sortDirection == 'desc'?
          <FontAwesome5 name={"sort-amount-up-alt"} style={{}} />
          : <FontAwesome5 name={"sort-amount-down-alt"} style={{}} />
        }
      </Pressable>
      <Pressable style={[styles.columnHeader, styles.sortableColumn]} onPress={()=>sortData('home_location')}>
        <Text>{'Home location'}</Text>
        {sortColumn == 'home_location' && sortDirection == 'desc'?
          <FontAwesome5 name={"sort-amount-up-alt"} style={{}} />
          : <FontAwesome5 name={"sort-amount-down-alt"} style={{}} />
        }
      </Pressable>
      <Pressable style={[styles.columnHeader, styles.sortableColumn]} onPress={()=>sortData('current_location')}>
        <Text>{'Current location'}</Text>
        {sortColumn == 'current_location' && sortDirection == 'desc'?
          <FontAwesome5 name={"sort-amount-up-alt"} style={{}} />
          : <FontAwesome5 name={"sort-amount-down-alt"} style={{}} />
        }
      </Pressable>
      <Pressable style={[styles.columnHeader, styles.sortableColumn, { width: 110 }]} onPress={()=>sortData('status')}>
        <Text>{'Status'}</Text>
        {sortColumn == 'status' && sortDirection == 'desc'?
          <FontAwesome5 name={"sort-amount-up-alt"} style={{}} />
          : <FontAwesome5 name={"sort-amount-down-alt"} style={{}} />
        }
      </Pressable>
      <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
      <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
    </View>
    <View style={{flex:1}}>
      <ScrollView>
        {renderTableData()}
      </ScrollView>
    </View>
  </View>), [filteredAndSortedData, checkedItemIds])

  return (
    <BasicLayout
      navigation={navigation}
      goBack={() => {
        openInventory(data?.searchOptions ? 'Product Lines' : null);
      }}
      screenName={'Products'}
      isLoading={isLoading}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Category</Text>
              <Picker
                style={[styles.searchInput]}
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
                style={[styles.searchInput]}
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
                style={[styles.searchInput]}
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
            {/* <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Product</Text>
              <TextInput
                style={styles.searchInput}
                placeholder=""
                value={searchProduct}
                onChangeText={setSearchProduct}
              />
            </View> */}
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
          {buttonsElement}
          {tableElement}
        </View>
      </ScrollView>
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
      <BulkUpdateLocationModal
        isModalVisible={isBulkUpdateLocationVisible}
        ids={checkedItemIds}
        setUpdateProductsTrigger={setUpdateProductsTrigger}
        closeModal={closeBulkUpdateLocation}
      />
      <BulkUpdateStatus
        isModalVisible={isBulkUpdateStatusVisible}
        ids={checkedItemIds}
        setUpdateProductsTrigger={setUpdateProductsTrigger}
        closeModal={closeBlukUPdateStatus}
      />
    </BasicLayout>
  );
};

const styles = productsStyle;

export default Products;
