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

const ReservationsList = ({ openReservationScreen }) => {
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
              <Text>{item.Stage}</Text>
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

const styles = reservationListsStyle;

export default ReservationsList;
