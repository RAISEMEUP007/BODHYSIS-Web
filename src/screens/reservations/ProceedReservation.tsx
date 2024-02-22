import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TouchableHighlight, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import { getReservationDetail, updateReservation } from '../../api/Reservation';
import { msgStr } from '../../common/constants/Message';

import { proceedReservationStyle } from './styles/ProceedReservationStyle';
import ReservationMainInfo from './ReservationMainInfo';
import { ReservationExtensionPanel } from './ReservationExtensionPanel/ReservationExtensionPanel';
import EquipmentsTable from './EquipmentsTable';
import AddTransactionModal from './ReservationExtensionPanel/AddTransactionModal';
import AddReservationItemModal from './AddReservationItemModal';
import AddCardModal from '../../common/components/stripe-react/AddCardModal';
import { getHeaderData, getPriceDataByGroup } from '../../api/Price';
import { getDiscountCodesData } from '../../api/Settings';

interface Props {
  openReservationScreen: (itemName: string, data?: any ) => void;
  initialData?: any;
}

export const ProceedReservation = ({ openReservationScreen, initialData }: Props) => {

  const customerId = "cus_PapWGjfCEdOh8J";

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [updateCount, setUpdateCount] = useState<number>(0);
  const [reservationInfo, setReservationInfo] = useState<any>();
  const [contentWidth, setContentWidth] = useState<number>();
  const [isAddTransactionModalVisible, setAddTransactionModalVisible] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([]);

  const openAddTransactionModal = () => {
    setAddTransactionModalVisible(true);
  };
  const closeAddTransactionModal = () => {
    setAddTransactionModalVisible(false);
  };

  const [isAddCardModalVisible, setAddCardModalVisible] = useState(false);
  const openAddCardModal = () => {
    setAddCardModalVisible(true);
  };
  const closeAddCardModal = () => {
    setAddCardModalVisible(false);
  };

  const [equipmentData, setEquipmentData] = useState<Array<any>>([]);
  const [isAddReservationItemModalVisible, setAddReservationItemModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState();
  const [editingIndex, setEditingIndex] = useState();

  const openAddReservationItemModal = () => {
    editReservationItem(null, null);
    setAddReservationItemModalVisible(true);
  };
  const closeAddReservationItemModal = () => {
    setAddReservationItemModalVisible(false);
  };

  const editReservationItem = (item, index) => {
    setAddReservationItemModalVisible(true);
    setEditingItem(item);
    setEditingIndex(index);
  };

  const addReservationItem = async (productLine, quantity) => {
    const equipment = { ...productLine, quantity };
    const newData = [...equipmentData, equipment];
    const cacluatedPricedData = await calculatePricedEquipmentData(reservationInfo.price_table_id, newData);
    saveReservationItems(cacluatedPricedData, ()=>{
      setEquipmentData(cacluatedPricedData);
      setUpdateCount(prev => prev + 1);
    })
  }

  const updateReservationItem = async (productLine, quantity) => {
    const newEquipment = { ...productLine, quantity };
    const replaceIndex = editingIndex;
    const newData = equipmentData.map((item, index) => {
      if (index === replaceIndex) {
        return { ...newEquipment };
      }
      return item;
    });
  
    const cacluatedPricedData = await calculatePricedEquipmentData(reservationInfo.price_table_id, newData);
    saveReservationItems(cacluatedPricedData, ()=>{
      setEquipmentData(cacluatedPricedData);
      setUpdateCount(prev => prev + 1);
    })
  }

  const removeReservationItem = async (item, index) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      const updatedEquipmentData = [...equipmentData.slice(0, index), ...equipmentData.slice(index + 1)];
      saveReservationItems(updatedEquipmentData, ()=>{
        setEquipmentData(updatedEquipmentData);
        setUpdateCount(prev => prev + 1);
      })
    });
  }

  const saveReservationItems = (items, callback) =>{
    if(!reservationInfo || !reservationInfo.id) return;

    const subTotal = items.reduce((total, item) => total + item.price, 0);
    const taxAmount = Math.round(subTotal * reservationInfo.tax_rate)/100;
    const discountInfo = discountCodes.find((item) => item.id === reservationInfo.promo_code);
    const discountAmount = discountInfo.type == 1 ? (Math.round(subTotal * discountInfo.amount) / 100) : discountInfo.amount;
    const totalPrice = subTotal + taxAmount - discountAmount;

    const payload = {
      id: reservationInfo.id,
      items : items,
      subtotal : subTotal,
      tax_amount : taxAmount,
      discount_amount : discountAmount,
      total_price: totalPrice,
    }

    updateReservation(payload, (jsonRes, status) => {
      switch (status) {
        case 201:
          callback();
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  const confirmNextStage = () =>{
    if(!reservationInfo || !reservationInfo.id) return;

    if(reservationInfo.stage > 3) return;

    const payload = {
      id: reservationInfo.id,
      stage: (reservationInfo.stage + 1),
    }

    updateReservation(payload, (jsonRes, status) => {
      switch (status) {
        case 201:
          setReservationInfo(prev => {
            return { ...prev, stage: (prev.stage + 1) };
          });
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  useEffect(()=>{
    getDiscountCodesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setDiscountCodes(jsonRes);
          break;
      }
    });
  }, [])

  useEffect(() => {
    if (!initialData || !initialData.reservationId) {
      showAlert('error', 'Non valid reservation!');
      openReservationScreen('Reservations List');
    }else{
      getReservationDetail(initialData.reservationId, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            if(jsonRes.total_price == 0){
              jsonRes.total_price = jsonRes.subtotal + jsonRes.tax_amount - jsonRes.discount_amount;
            }
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
  }, [initialData, updateCount]);

  
  useEffect(() => {
    if(reservationInfo && reservationInfo.price_table_id){
      getHeaderData(reservationInfo.price_table_id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setHeaderData(jsonRes);
            break;
          case 500:
            showAlert('error', msgStr('serverError'));
            setHeaderData([]);
            break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            setHeaderData([]);
            break;
        }
      });
    }else setHeaderData([]);
  }, [reservationInfo]);

  const subTotal = useMemo(()=>{
    if(equipmentData.length>0){
      const subtotal = equipmentData.reduce((total, item) => total + item.price, 0);
      return subtotal;
    }else return 0;
  }, [equipmentData]);

  // const calculatePricedData = async (equipmentData) => {
  //   if (equipmentData.length > 0) {
  //     if (headerData && reservationInfo.price_table_id) {
  //       const tableId = reservationInfo.price_table_id;
  //       const pricedEquipmentData = await calculatePricedEquipmentData(tableId, equipmentData);
  //       return pricedEquipmentData;
  //     }else{
  //       const pricedEquipmentData = equipmentData.map((item) => ({ ...item, price: 0 }));
  //       return pricedEquipmentData;
  //     }
  //   }
  //   return [];
  // };

  const calculatePricedEquipmentData = async (tableId, equipmentData) => {
    const pricedEquipmentData = await Promise.all(equipmentData.map(async (item) => {
      const payload = {
        tableId,
        groupId: item.family.price_group_id,
      }
      const response = await getPriceDataByGroup(payload);
      const rows = await response.json();

      const reversedHeaderData = headerData.slice().reverse();
      const updatedReversedHeaderData = reversedHeaderData.map((item) => {
        const value = rows.find((row) => row.point_id === item.id)?.value || 0;
        const pricePMS = value/item.milliseconds;
        const pricePH = value / (item.milliseconds / (1000 * 60 * 60));
        const pricePD = value / (item.milliseconds / (1000 * 60 * 60 * 24));
        return { ...item, value, pricePH, pricePD };
      });

      const diff = new Date(reservationInfo.end_date).getTime() - new Date(reservationInfo.start_date).getTime();

      const basedonPoint  = updatedReversedHeaderData.find((item) => {
        if(item.value>0 && item.milliseconds <= diff){
          return item;
        }
      });

      let price = 0;
      if(basedonPoint){
        if(Math.floor(diff/(1000 * 60 * 60 *24)) == 0) price = basedonPoint.pricePH * Math.floor(diff/(1000 * 60 * 60));
        else price = basedonPoint.pricePD * Math.floor(diff/(1000 * 60 * 60 * 24));

        price = Math.round(price*100)/100 * item.quantity;
      }
      return { ...item, price };
    }));
    return pricedEquipmentData;
  }

  useEffect(() => {
    if(reservationInfo) {
      if(typeof reservationInfo.items === 'string'){
        setEquipmentData(JSON.parse(reservationInfo.items));
      }else if(typeof reservationInfo.items === 'object') {
        setEquipmentData(reservationInfo.items);
      }
    }
  }, [reservationInfo])

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

  const convertStageToBgColor = (stage) => {
    switch (stage) {
      case 1: case '1': return '#262E32';
      case 2: case '2': return '#4379FF';
      case 3: case '3': return '#B8393C';
      case 4: case '4': return '#4CBA70';
      default:  return '#262E32';
    }
  }

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
            <ReservationMainInfo details={reservationInfo} setUpdateCount={setUpdateCount}/>
            <ReservationExtensionPanel reservationId={reservationInfo?.id??null} openAddTransactionModal={openAddTransactionModal}/>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:18}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <View style={[styles.stageText, {backgroundColor:convertStageToBgColor(reservationInfo?.stage??null)}]}>
                <View style={[styles.circle, {left:10}]}></View>
                <View style={[styles.circle, {right:10}]}></View>
                <Text style={{color:'white', fontWeight:'bold', fontSize:15, fontFamily:'monospace'}}>{convertStageToString(reservationInfo?.stage??null)}</Text>
              </View>
              <TouchableOpacity style={[styles.nextStageButton]} onPress={confirmNextStage}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={styles.buttonText}>Next stage</Text>
                  <FontAwesome5 name="angle-right" size={18} color="white" style={{marginLeft:10}}/>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <TouchableOpacity style={styles.outLineButton}>
                <Text style={styles.outlineBtnText}>Print</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outLineButton}>
                <Text style={styles.outlineBtnText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.outLineButton, {borderColor: '#4379FF'}]} onPress={openAddCardModal}>
                <Text style={[styles.outlineBtnText, {color:'#4379FF'}]}>Stripe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.outLineButton, {borderColor:'#DC3545'}]}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <FontAwesome5 name={'bookmark'} size={18} color="#DC3545" style={{marginRight:10, marginTop:1}}/>
                  <Text style={[styles.outlineBtnText, {color:'#DC3545'}]}>Add</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.outLineButton, {borderColor:'#DC3545'}]} onPress={openAddTransactionModal}>
                <Text style={[styles.outlineBtnText, {color:'#DC3545'}]}>Add transaction</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outLineButton}>
                <Text style={styles.outlineBtnText}>More</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.reservationRow, {justifyContent:'flex-end'}]}>
            <TouchableHighlight style={[styles.addItemButton]} onPress={openAddReservationItemModal}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <FontAwesome5 name="plus" size={14} color="white" style={{marginTop:3}}/>
                <Text style={styles.buttonText}>Add Items</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View>
            <EquipmentsTable
              items={equipmentData}
              width={contentWidth}
              onEdit={(item, index)=>{
                editReservationItem(item, index);
              }}
              onDelete={(item, index)=>{
                removeReservationItem(item, index);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <AddTransactionModal
        isModalVisible={isAddTransactionModalVisible}
        customerId={customerId}
        reservationInfo = {reservationInfo}
        addCard={openAddCardModal}
        closeModal={closeAddTransactionModal}
        // onAdded={(paymentMethod, amount)=>{
        //   // addTransaction(paymentMethod, amount);
        // }}
      />
      <AddReservationItemModal
        isModalVisible={isAddReservationItemModalVisible}
        closeModal={closeAddReservationItemModal}
        item={editingItem}
        onAdded={(productLine, quantity)=>{
          if (productLine) {
            addReservationItem(productLine, quantity);
          }
        }}
        onUpdated={(productLine, quantity)=>{
          if (productLine) {
            updateReservationItem(productLine, quantity);
          }
          editReservationItem(null, null);
        }}
      />
      {Platform.OS === 'web' && (
        <AddCardModal
          isModalVisible={isAddCardModalVisible}
          customerId = {customerId}
          reservationId={reservationInfo?.id??null}
          closeModal={closeAddCardModal}
        />
      )}
    </BasicLayout>
  );
};

const styles = proceedReservationStyle
