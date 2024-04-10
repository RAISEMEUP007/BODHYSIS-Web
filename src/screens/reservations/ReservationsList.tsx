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

import { getReservationsData } from '../../api/Reservation';
import { msgStr } from '../../common/constants/Message';
import { TextMediumSize } from '../../common/constants/Fonts';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';

import { reservationListsStyle } from './styles/ReservationListStyle';

const ReservationsList = ({ navigation, openReservationScreen }) => {
  const screenHeight = Dimensions.get('window').height;

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateReservationListTrigger, setUpdateReservationListTrigger] = useState(true);

  useEffect(() => {
    if (updateReservationListTrigger == true) getTable();
  }, [updateReservationListTrigger]);

  // const removeReservationList = (id) => {
  //   showConfirm(msgStr('deleteConfirmStr'), () => {
  //     deleteReservationList(id, (jsonRes, status, error) => {
  //       switch (status) {
  //         case 200:
  //           setUpdateReservationListTrigger(true);
  //           showAlert('success', jsonRes.message);
  //           break;
  //         default:
  //           if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
  //           else showAlert('error', msgStr('unknownError'));
  //           break;
  //       }
  //     });
  //   });
  // };

  const getTable = () => {
    getReservationsData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdateReservationListTrigger(false);
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
            <View style={[styles.cell, {width: 90}]}>
              <Text>{item.order_number}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.brand}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.full_name}</Text>
            </View>
            <View style={[styles.cell, {width: 250}]}>
              <Text>{item.delivery_address}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item.start_location}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{item?.quantity??''}</Text>
            </View>
            <View style={[styles.cell]}>
              <Text>{convertStageToString(item.stage)}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  openReservationScreen('Proceed Reservation', {reservationId:item.id})
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
      navigation={navigation}
      screenName={'Reservation List'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={()=>{
              openReservationScreen('Create Reservations');
            }}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, {width:90}]}>{'Order #'}</Text>
              <Text style={[styles.columnHeader]}>{'Brand'}</Text>
              <Text style={[styles.columnHeader]}>{'Customer'}</Text>
              <Text style={[styles.columnHeader, {width:250}]}>{'To'}</Text>
              <Text style={[styles.columnHeader]}>{'From'}</Text>
              {/* <Text style={[styles.columnHeader, {width:100}]}>{'Start Date'}</Text>
              <Text style={[styles.columnHeader, {width:100}]}>{'End Date'}</Text> */}
              <Text style={[styles.columnHeader]}>{'Qty of bikes'}</Text>
              <Text style={[styles.columnHeader]}>{'Stage'}</Text>
              {/* <Text style={[styles.columnHeader, styles.IconCell]}>{'Proceed'}</Text> */}
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

const styles = reservationListsStyle;

export default ReservationsList;
