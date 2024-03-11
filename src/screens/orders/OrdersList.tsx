import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getOrdersData } from '../../api/Order';
import { msgStr } from '../../common/constants/Message';
import { TextMediumSize } from '../../common/constants/Fonts';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';

import { orderListsStyle } from './styles/OrderListStyle';

const OrdersList = ({ openOrderScreen }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateOrderListTrigger, setUpdateOrderListTrigger] = useState(true);

  useEffect(() => {
    if (updateOrderListTrigger == true) getTable();
  }, [updateOrderListTrigger]);

  const getTable = () => {
    getOrdersData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateOrderListTrigger(false);
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
    const convertStageToString = (stage) => {
      switch (stage) {
        case null: case 'null': return 'Draft';
        case 0: case '0': return 'Draft';
        case 1: case '1': return 'Provisional';
        case 2: case '2': return 'Confirmed';
        case 3: case '3': return 'Checked out';
        case 4: case '4': return 'Checked in';
        default:  return 'Invalid stage';
      }
    }

    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell]}>
              <Text>{item.full_name}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.brand}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.start_location}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.end_location}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.start_date ? new Date(item.start_date).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }) : ''}
              </Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.end_date ? new Date(item.end_date).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }) : ''}
              </Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.discount_code}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{convertStageToString(item.stage)}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  openOrderScreen('Proceed Order', {orderId:item.id})
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="arrow-right" color="black" />
              </TouchableOpacity>
            </View>
            {/* <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
            </View> */}
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
      screenName={'Order List'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader]}>{'Customer Name'}</Text>
              <Text style={[styles.columnHeader]}>{'Brand'}</Text>
              <Text style={[styles.columnHeader]}>{'Start Location'}</Text>
              <Text style={[styles.columnHeader]}>{'End Location'}</Text>
              <Text style={[styles.columnHeader]}>{'Start Date'}</Text>
              <Text style={[styles.columnHeader]}>{'End Date'}</Text>
              <Text style={[styles.columnHeader]}>{'Promo Code'}</Text>
              <Text style={[styles.columnHeader]}>{'Stage'}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{'Proceed'}</Text>
              {/* <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text> */}
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight - 220 }}>
              {renderTableData()}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = orderListsStyle;

export default OrdersList;
