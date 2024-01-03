import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';
import { useNavigation } from '@react-navigation/native';
import CommonInput from '../../../common/components/input/CommonInput';
import { Colors } from '../../../common/constants/Colors';
import Slots, { SlotType } from '../../../common/slots/slots';
import { DEFAULT_TIME_SLOTS } from '../../../common/constants/DefaultTimeSlots';
import { CommonButton } from '../../../common/components/CommonButton/CommonButton';
import { EquipmentDropdown } from './EquipmentDropdown';
import { Modalize } from 'react-native-modalize';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { RESERVATION_FORMAT } from '../../../common/constants/DateFormat';
import { CreateReservationDetails } from './CreateReservationDetails';
import { useDispatch } from 'react-redux';
import { updateReservation } from '../../../redux/slices/reservationSlice';
import { useRequestReservationTypesQuery } from '../../../redux/slices/baseApiSlice';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

interface Props {
  openInventory: () => void;
}

const CreateReservation = ({ openInventory }: Props) => {
  const modalizeRef = useRef<Modalize>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(
    dayjs().set('hours', 0).set('minutes', 0).set('seconds', 0).set('milliseconds', 0).toDate()
  );

  const { showAlert } = useAlertModal();

  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>();

  const [showDetails, setShowDetails] = useState(false);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [valid, setValid] = useState(false);

  const { data } = useRequestReservationTypesQuery({});

  const sanitizeDate = useCallback((date: Date) => {
    const day = dayjs(date);
    const result = day.set('hours', 0).set('minutes', 0).set('seconds', 0).set('milliseconds', 0);
    return result.toDate();
  }, []);

  const endDate = useMemo(() => {
    if (!selectedDate || !selectedSlot) {
      return null;
    }

    const milisecondsToAdd = selectedSlot.value;

    const startDay = dayjs(selectedDate);

    return startDay.add(milisecondsToAdd, 'milliseconds').toDate();
  }, [selectedDate, selectedSlot]);

  const renderInitial = () => {
    return (
      <BasicLayout
        containerStyle={styles.layoutContainer}
        screenName={'Create Reservation'}
        navigation={navigation}
      >
        <ScrollView>
          <View style={styles.outterContainer}>
            <CommonInput title={'Customer Input'} />
            <CommonInput title={'Location'} />
            <View style={{ ...styles.timeContainer, width: 400 }}>
              <CommonInput
                onFocus={() => {
                  modalizeRef.current.open();
                }}
                value={selectedDate && dayjs(selectedDate).format(RESERVATION_FORMAT)}
                width={190}
                title={'Pick Up Time'}
                placeholder="Select Date"
              />
              <CommonInput
                value={endDate && dayjs(endDate).format(RESERVATION_FORMAT)}
                width={190}
                title={'Drop Off Time'}
              />
            </View>
            <Slots
              onSelect={(item) => {
                setSelectedSlot(item);
                setValid(true);
              }}
              items={DEFAULT_TIME_SLOTS}
            />
            <Text style={styles.equipmentText}>{'Equipment'}</Text>
            <CommonButton
              onPress={() => {}}
              label={'Search'}
              backgroundColor={Colors.Secondary.NAVY}
              type={'rounded'}
              textColor={Colors.Neutrals.WHITE}
            />
            <EquipmentDropdown />
            <View style={styles.width}>
              <CommonButton
                width={177}
                onPressWhileDisabled={() => {
                  showAlert('warning', 'Please select a drop-off time.');
                }}
                onPress={() => {
                  setShowDetails(true);
                  dispatch(
                    updateReservation({
                      startDate: selectedDate.toISOString(),
                      endDate: endDate && endDate.toISOString(),
                    })
                  );
                }}
                label={'Create Reservation'}
                disabledConfig={{ backgroundColor: Colors.Neutrals.DARK, disabled: !valid }}
                backgroundColor={Colors.Secondary.GREEN}
                type={'rounded'}
                textColor={Colors.Neutrals.WHITE}
                containerStyle={{
                  marginRight: 20,
                }}
              />
              <CommonButton
                onPress={() => {}}
                label={'Cancel'}
                backgroundColor={Colors.Secondary.MAROON}
                type={'rounded'}
                textColor={Colors.Neutrals.WHITE}
              />
            </View>
          </View>
        </ScrollView>
        <Modalize ref={modalizeRef}>
          <View style={styles.modal}>
            <Text style={styles.selectDateModalText}>{'Select Date'}</Text>
            <DatePicker
              onChange={(date) => {
                modalizeRef.current.close();
                setSelectedDate(sanitizeDate(date));
              }}
            />
          </View>
        </Modalize>
      </BasicLayout>
    );
  };

  if (showDetails) {
    return (
      <CreateReservationDetails
        goBack={() => {
          setShowDetails(false);
        }}
      />
    );
  }

  return renderInitial();
};

const styles = StyleSheet.create({
  layoutContainer: {
    backgroundColor: Colors.Neutrals.WHITE,
  },
  outterContainer: {
    padding: 20,
    backgroundColor: Colors.Neutrals.WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.Neutrals.WHITE,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  equipmentText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 15,
  },
  width: {
    flexDirection: 'row',
  },
  modal: {
    padding: 20,
  },
  selectDateModalText: {
    fontSize: 20,
    marginBottom: 5,
  },
  bottomContainer: {
    paddingHorizontal: 20,
  },
});

export default CreateReservation;
