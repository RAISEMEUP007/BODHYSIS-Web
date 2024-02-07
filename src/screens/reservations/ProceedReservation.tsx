import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { getReservationDetail } from '../../api/Reservation';
import { msgStr } from '../../common/constants/Message';
import { proceedReservationStyle } from './styles/ProceedReservationStyle';
import ReservationMainInfo from './ReservationMainInfo';

interface Props {
  openReservationScreen: (itemName: string, data?: any ) => void;
  initialData?: any;
}

export const ProceedReservation = ({ openReservationScreen, initialData }: Props) => {
  console.log(initialData);
  const { showAlert } = useAlertModal();
  const [reservationInfo, setReservationInfo] = useState();

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
      <ScrollView contentContainerStyle={styles.topContainer}>
        <View style={styles.container}>
          <View>
            <ReservationMainInfo details={reservationInfo}/>
          </View>
        </View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = proceedReservationStyle
