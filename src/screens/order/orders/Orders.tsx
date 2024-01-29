import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getOrdersData, deleteOrder } from '../../../api/Order';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { ordersStyle } from './styles/OrdersStyle';
import AddOrderModal from './AddOrderModal';

const Orders = ({ navigation }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateOrderTrigger, setUpdateOrderTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchKey, setSearchKey] = useState('');

  const openAddOrderModal = () => {
    setAddModalVisible(true);
    setSelectedOrder(null);
  };
  const closeAddOrderModal = () => {
    setAddModalVisible(false);
    setSelectedOrder(null);
  };
  const editOrder = (index) => {
    setSelectedOrder(tableData[index]);
    setAddModalVisible(true);
  };

  useEffect(() => {
    if (updateOrderTrigger == true) getTable();
  }, [updateOrderTrigger]);

  const removeOrder = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deleteOrder(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdateOrderTrigger(true);
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
    getOrdersData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateOrderTrigger(false);
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
    let filteredData;
    if (searchKey.trim() === '') {
      filteredData = tableData;
    } else {
      filteredData = tableData.filter((item) => {
        return (
          Object.values(item).some((value) => {
            if (value && typeof value === 'string') {
              return value.toLowerCase().includes(searchKey.trim().toLowerCase());
            }
            return false;
          }) ||
          item.country.country.toLowerCase().includes(searchKey.trim().toLowerCase()) ||
          item.home_location_tbl.location.toLowerCase().includes(searchKey.trim().toLowerCase())
        );
      });
    }

    console.log();
    const rows = [];
    if (filteredData.length > 0) {
      filteredData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, { width: 200 }]}>
              <Text>
                {new Date(item.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>{item.first_name}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{item.last_name}</Text>
            </View>
            <View style={[styles.cell, { width: 200 }]}>
              <Text>{item.email}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.phone_number}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.mobile_phone}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.country.country}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.home_location_tbl.location}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  editOrder(index);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  removeOrder(item.id);
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
    <BasicLayout navigation={navigation} screenName={'Orders'}>
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddOrderModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>Search</Text>
              <TextInput
                style={styles.searchInput}
                placeholder=""
                value={searchKey}
                onChangeText={setSearchKey}
              />
            </View>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, { width: 200 }]}>{'Created'}</Text>
              <Text style={[styles.columnHeader]}>{'First name'}</Text>
              <Text style={[styles.columnHeader]}>{'Last name'}</Text>
              <Text style={[styles.columnHeader, { width: 200 }]}>{'Email'}</Text>
              <Text style={[styles.columnHeader]}>{'Phone number'}</Text>
              <Text style={[styles.columnHeader]}>{'Mobile number'}</Text>
              <Text style={[styles.columnHeader]}>{'Country'}</Text>
              <Text style={[styles.columnHeader]}>{'Location'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
              {renderTableData()}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <AddOrderModal
        isModalVisible={isAddModalVisible}
        Order={selectedOrder}
        setUpdateOrderTrigger={setUpdateOrderTrigger}
        closeModal={closeAddOrderModal}
      />
    </BasicLayout>
  );
};

const styles = ordersStyle;

export default Orders;
