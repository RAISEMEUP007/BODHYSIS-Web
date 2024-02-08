import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { getReservationDetail } from '../../api/Reservation';
import { msgStr } from '../../common/constants/Message';

import { proceedReservationStyle } from './styles/ProceedReservationStyle';
import ReservationMainInfo from './ReservationMainInfo';
import { ReservationExtensionPanel } from './ReservationExtensionPanel/ReservationExtensionPanel';
import EquipmentsTable from './EquipmentsTable';

interface Props {
  openReservationScreen: (itemName: string, data?: any ) => void;
  initialData?: any;
}

export const ProceedReservation = ({ openReservationScreen, initialData }: Props) => {
  const { showAlert } = useAlertModal();
  const [reservationInfo, setReservationInfo] = useState<any>();
  const [contentWidth, setContentWidth] = useState<number>();

  useEffect(() => {
    if (!initialData || !initialData.reservationId) {
      showAlert('error', 'Non valid reservation!');
      openReservationScreen('Reservations List');
    }else{
      getReservationDetail(initialData.reservationId, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setReservationInfo(jsonRes);
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
    }
  }, [initialData]);

  return (
    <BasicLayout 
      goBack={()=>{
        openReservationScreen('Reservations List');
      }} 
      screenName={'Proceed Reservation'} 
    >
      <ScrollView 
        contentContainerStyle={styles.topContainer}
        onContentSizeChange={(width, height) => {
          // setContentWidth(width);
        }}>
        <View style={styles.container}>
          <View 
          style={{flexDirection:'row'}}           
            onLayout={(event)=>{
              const { width } = event.nativeEvent.layout;
              setContentWidth(width);
            }}>
            <ReservationMainInfo details={reservationInfo}/>
            <ReservationExtensionPanel/>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:18}}>
            <View>
              <TouchableOpacity style={[styles.nextStageButton]} >
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.buttonText}>Next stage</Text>
                  <FontAwesome5 name="angle-right" size={18} color="white" style={{marginTop:1, marginLeft:10}}/>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity style={styles.outLineButton}>
                <Text style={styles.outlineBtnText}>Print</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outLineButton}>
                <Text style={styles.outlineBtnText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outLineButton}>
                <Text style={styles.outlineBtnText}>Stripe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.outLineButton, {borderColor:'#DC3545'}]}>
                <View style={{flexDirection:'row'}}>
                  <FontAwesome5 name={'bookmark'} size={18} color="#DC3545" style={{marginRight:8, marginTop:1}}/>
                  <Text style={[styles.outlineBtnText, {color:'#DC3545'}]}>Add</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.outLineButton, {borderColor:'#DC3545'}]}>
                <Text style={[styles.outlineBtnText, {color:'#DC3545'}]}>Add transactions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outLineButton}>
                <Text style={styles.outlineBtnText}>More</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <EquipmentsTable
              items={reservationInfo?.items??[]}
              width={contentWidth}
              // onEdit={(item, index)=>{
              //   editReservationItem(item, index);
              // }}
              // onDelete={(item, index)=>{
              //   const updatedEquipmentData = [...equipmentData.slice(0, index), ...equipmentData.slice(index + 1)];
              //   setEquipmentData(updatedEquipmentData);
              // }}
            />
          </View>
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = proceedReservationStyle
