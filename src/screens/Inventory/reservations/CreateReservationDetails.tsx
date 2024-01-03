import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';
import { Colors } from '../../../common/constants/Colors';
import { useSelector } from 'react-redux';
import { getReservationInfoSelector } from '../../../redux/selectors/reservationSelector';
import { ReservationDetailsBasicInfo } from './ReservationDetailsBasicInfo';
import { ReservationTabView } from './ReservationTabView';
import { ProductIdInput } from './ProductIdInput';
import { CommonButton } from '../../../common/components/CommonButton/CommonButton';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

interface Props {
  goBack: () => void;
}

export const CreateReservationDetails = ({ goBack }: Props) => {
  const reservationInfo = useSelector(getReservationInfoSelector);

  const { showAlert } = useAlertModal();

  const navigation = useNavigation();
  return (
    <BasicLayout goBack={goBack} screenName={'Create Reservation'} navigation={navigation}>
      <ScrollView style={styles.container}>
        <View style={styles.topContainer}>
          <ReservationDetailsBasicInfo width={400} inputPadding={20} />
          <ReservationTabView />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.leftBottomContainer}>
            <ProductIdInput
              onSubmit={() => {
                showAlert('success', 'Added item to product.');
              }}
              onChangeText={(value) => {}}
            />
          </View>
          <View style={styles.rightBottomContainer}>
            <CommonButton
              height={40}
              containerStyle={styles.button}
              type="rounded"
              onPress={() => {}}
              label="Print"
            />
            <CommonButton
              height={40}
              containerStyle={styles.button}
              type="rounded"
              onPress={() => {}}
              label="Email"
            />
            <CommonButton
              height={40}
              containerStyle={styles.button}
              type="rounded"
              onPress={() => {}}
              label="Stripe"
            />
            <CommonButton
              height={40}
              containerStyle={styles.button}
              type="rounded"
              onPress={() => {}}
              label="Add"
            />
            <CommonButton
              height={40}
              width={140}
              containerStyle={styles.button}
              type="rounded"
              onPress={() => {}}
              label="Add Transaction"
            />
            <CommonButton
              height={40}
              containerStyle={styles.button}
              type="rounded"
              onPress={() => {}}
              label="More"
            />
          </View>
        </View>
        <View style={styles.footerContainer}></View>
      </ScrollView>
    </BasicLayout>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: Colors.Neutrals.WHITE,
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.Neutrals.LIGHT_GRAY,
  },
  bottomContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.Neutrals.WHITE,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.Neutrals.WHITE,
  },
  leftBottomContainer: {
    width: '50%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rightBottomContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    height: 60,
  },
  button: {
    paddingVertical: 2,
    marginRight: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.Neutrals.LIGHT_GRAY,
    height: 300,
  },
});
