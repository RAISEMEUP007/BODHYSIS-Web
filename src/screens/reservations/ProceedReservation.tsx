import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TouchableHighlight, Platform, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

import { deleteReservationItem, getReservationDetail, updateReservation } from '../../api/Reservation';
import { getHeaderData, getTableData } from '../../api/Price';
import { getDiscountCodesData } from '../../api/Settings';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';
import { msgStr } from '../../common/constants/Message';
import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import { printReservation } from '../../common/utils/Print';
import AddCardModal from '../../common/components/stripe-react/AddCardModal';

import ReservationMainInfo from './ReservationMainInfo';
import { ReservationExtensionPanel } from './ReservationExtensionPanel/ReservationExtensionPanel';
import EquipmentsTable from './EquipmentsTable';
import AddTransactionModal from './ReservationExtensionPanel/AddTransactionModal';
import AddReservationItemModal from './AddReservationItemModal';
import RefundStripeModal from './ReservationExtensionPanel/RefundStripeModal';

import { proceedReservationStyle } from './styles/ProceedReservationStyle';
import { getCustomerIdById } from '../../api/Stripe';
import { calculatePricedEquipmentData, getPriceTableByBrandAndDate } from './CalcPrice';
import { useRequestPriceLogicDataQuery } from '../../redux/slices/baseApiSlice';

interface Props {
  openReservationScreen: (itemName: string, data?: any ) => void;
  initialData?: any;
}

export const ProceedReservation = ({ openReservationScreen, initialData }: Props) => {

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [updateCount, setUpdateCount] = useState<number>(0);
  const [reservationInfo, setReservationInfo] = useState<any>();
  const [isAddTransactionModalVisible, setAddTransactionModalVisible] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [nextStageProcessingStatus, setNextStageProcessingStatus] = useState<boolean>(false);
  const [isRefundStripeModalVisible, setRefundStripeModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string|null>(null);
  const { data: priceLogicData } = useRequestPriceLogicDataQuery({}, { refetchOnFocus: true });
  const [price_table_id, setPriceTableId] = useState(null);
  const [priceTableData, setPricetableData] = useState(null);
  
  const [refundDetails, setRefundDetails] = useState<any>({
    id: null,
    amount: null,
    payment_intent: null
  });

  const openRefundModal = (refundDetails) => {
    setRefundDetails(refundDetails)
    setRefundStripeModalVisible(true);
  };
  const closeRefundModal = () => {
    setRefundStripeModalVisible(false);
  };

  const openAddTransactionModal = (nextStageProcessingStatus) => {
    setNextStageProcessingStatus(nextStageProcessingStatus);
    setAddTransactionModalVisible(true);
  };
  const closeAddTransactionModal = () => {
    setAddTransactionModalVisible(false);
    setUpdateCount(prev => prev + 1);
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

  const calcAndSetData = async (ReservationItems:Array<any>) =>{
    const calculatedReservedItems = await calculatePricedEquipmentData(headerData, price_table_id, priceTableData, ReservationItems, new Date(`${reservationInfo.start_date} 0:0:0`), new Date(`${reservationInfo.end_date} 0:0:0`));

    let prices = {
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    }

    calculatedReservedItems.map((item:any)=>{
      let subtotal = item.price || 0;
      prices.subtotal += subtotal;
    });

    if(reservationInfo.promo_code){
      const selectedDiscount:any = discountCodes.find((item:any) => {
          return item.id == reservationInfo.promo_code;
      });

      if(selectedDiscount){
        prices.discount = selectedDiscount.type == 1 ? (Math.round(prices.subtotal * selectedDiscount.amount) / 100) : selectedDiscount.amount;
      }else{
        prices.discount = 0;
      }
    }
    prices.tax = (prices.subtotal - prices.discount + (reservationInfo.driver_tip || 0)) * (reservationInfo.tax_rate?reservationInfo.tax_rate/100:0) ?? 0;
    prices.total = prices.subtotal - prices.discount + (reservationInfo.driver_tip || 0) + prices.tax;

    const payload = {
      id: reservationInfo.id,
      items : calculatedReservedItems,
      subtotal : prices.subtotal,
      tax_amount : prices.tax,
      discount_amount : prices.discount,
      total_price: prices.total,
    }

    updateReservation(payload, (jsonRes, status) => {
      switch (status) {
        case 201:
          setUpdateCount(prev => prev + 1);
          break;
        default:
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  const addReservationItem = async (productFamily, quantity, extras) => {
    setIsLoading(true);

    const newItem = {
      ...productFamily,
      id: parseInt(uuidv4(), 16),
      reservation_id: reservationInfo.id,
      family_id: productFamily.id,
      price_group_id: productFamily?.lines[0]?.price_group_id ?? 0,
      quantity: 1,
      extras: extras,
    }

    let newData = [...equipmentData];
    if(quantity){
      for(let i=0; i<quantity; i++){
        newData.push(newItem);
      }
    }
    calcAndSetData(newData);
  }

  const updateReservationItem = async (oldFamily, newFamily, quantity, extras) => {
    setIsLoading(true);
    const newItem = {
      ...newFamily,
      id: oldFamily.id,
      reservation_id: oldFamily.reservation_id,
      family_id: newFamily.id,
      price_group_id: newFamily?.lines[0]?.price_group_id ?? 0,
      quantity: 1,
      extras: extras,
    }

    const replaceIndex = editingIndex;
    const newData = equipmentData.map((item, index) => {
      if (index === replaceIndex) {
        return { ...newItem };
      }
      return item;
    });
  
    calcAndSetData(newData);
  }

  const removeReservationItem = async (item, index) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      const updatedEquipmentData = [...equipmentData.slice(0, index), ...equipmentData.slice(index + 1)];
      setIsLoading(true);
      deleteReservationItem({id:item.id}, (jsonRes, status)=>{
        if(status == 200){
          calcAndSetData(updatedEquipmentData);
        }
      })
    });
  }

  const confirmNextStage = () =>{
    if(!reservationInfo || !reservationInfo.id) return;

    if(reservationInfo.stage > 3) return;

    if(reservationInfo.paid < reservationInfo.total_price){
      openAddTransactionModal(true);
    }else processNextStage();

    return;
  }

  const processNextStage = () => {
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
      setNextStageProcessingStatus(false);
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
      setIsLoading(true);
      getReservationDetail(initialData.reservationId, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            if(jsonRes.total_price == 0){
              jsonRes.total_price = jsonRes.subtotal + jsonRes.tax_amount - jsonRes.discount_amount;
            }
            setReservationInfo(jsonRes);
            setIsLoading(false);
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
      getTableData(reservationInfo.price_table_id, (jsonRes:any, status, error) => {
        switch (status) {
          case 200:
            setPricetableData(jsonRes)
            break;
          default:
            setPricetableData(null);
            break;
        }
      });
    }else{
      setHeaderData([]);
      setPricetableData([]);
    } 

  }, [(reservationInfo && reservationInfo.price_table_id)]);

  useEffect(() => {
    if(reservationInfo && reservationInfo.start_date){
      const priceTable = getPriceTableByBrandAndDate(priceLogicData, reservationInfo.brand_id, new Date(reservationInfo.start_date));
      setPriceTableId(priceTable?.id??null);
    }
  }, [priceLogicData, (reservationInfo && reservationInfo.brand_id), (reservationInfo && reservationInfo.start_date)])

  useEffect(()=>{
    if(reservationInfo && reservationInfo.customer_id ){
      getCustomerIdById({id:reservationInfo.customer_id}, (jsonRes, status)=>{
        if(status == 200) setCustomerId(jsonRes)
        else setCustomerId(null);
      })
    }else setCustomerId(null);
  }, [reservationInfo && reservationInfo.customer_id])

  useEffect(() => {
    if(reservationInfo) {
      if(typeof reservationInfo.items === 'string'){
        setEquipmentData(JSON.parse(reservationInfo.items));
      }else if(typeof reservationInfo.items === 'object') {
        setEquipmentData(reservationInfo.items);
      }
    }
  }, [reservationInfo])

  useEffect(()=>{
    if( headerData.length>0 && price_table_id && priceTableData && reservationInfo.start_date && reservationInfo.end_date && reservationInfo.items){
      calcAndSetData(reservationInfo.items);
    }
  }, [
    (reservationInfo && reservationInfo.start_date),
    (reservationInfo && reservationInfo.end_date),
    (reservationInfo && reservationInfo.driver_tip),
    (reservationInfo && reservationInfo.promo_code),
    (reservationInfo && reservationInfo.tax_rate),
  ]);

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
      containerStyle={{
        backgroundColor:'#f7f7f7',
      }}
    >
      <div style={{overflow:'auto', padding:'0 30px'}}>
        <div style={{width:'fit-content', margin:'auto'}}>
          <View style={styles.container}>
            <View style={{flexDirection:'row', zIndex:10}}>
              <ReservationMainInfo details={reservationInfo} setUpdateCount={setUpdateCount}/>
              <ReservationExtensionPanel 
                reservationId={reservationInfo?.id??null} 
                openAddTransactionModal={()=>openAddTransactionModal(false)}
                openRefundModal={openRefundModal}
              />
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:18}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={[styles.stageText, {backgroundColor:convertStageToBgColor(reservationInfo?.stage??null)}]}>
                  <View style={[styles.circle, {left:10}]}></View>
                  <View style={[styles.circle, {right:10}]}></View>
                  <Text style={{color:'white', fontWeight:'bold', fontSize:15, fontFamily:'monospace'}}>{convertStageToString(reservationInfo?.stage??null)}</Text>
                </View>
                <TouchableOpacity 
                  disabled={(reservationInfo && reservationInfo.stage>3)?true:false}
                  style={[
                    styles.nextStageButton,
                    (reservationInfo && reservationInfo.stage > 3) && { backgroundColor: '#ccc' }
                  ]}
                  onPress={confirmNextStage}>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={styles.buttonText}>Next stage</Text>
                    <FontAwesome5 name="angle-right" size={18} color="white" style={{marginLeft:10}}/>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <TouchableOpacity style={styles.outLineButton} onPress={()=>printReservation(reservationInfo.id)}>
                  <Text style={styles.outlineBtnText}>Print</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outLineButton}>
                  <Text style={styles.outlineBtnText}>Email</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={[styles.outLineButton, {borderColor: '#4379FF'}]} onPress={openAddCardModal}>
                  <Text style={[styles.outlineBtnText, {color:'#4379FF'}]}>Stripe</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={[styles.outLineButton, {borderColor:'#DC3545'}]}>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <FontAwesome5 name={'bookmark'} size={18} color="#DC3545" style={{marginRight:10, marginTop:1}}/>
                    <Text style={[styles.outlineBtnText, {color:'#DC3545'}]}>Add</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.outLineButton, {borderColor:'#DC3545'}]} onPress={()=>openAddTransactionModal(false)}>
                  <Text style={[styles.outlineBtnText, {color:'#DC3545'}]}>Add transaction</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outLineButton}>
                  <Text style={styles.outlineBtnText}>More</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.reservationRow, {justifyContent:'flex-end'}]}>
              <TouchableHighlight 
                style={[styles.addItemButton]} 
                onPress={openAddReservationItemModal}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <FontAwesome5 name="plus" size={14} color="white" style={{marginTop:3}}/>
                  <Text style={styles.buttonText}>Add Items</Text>
                </View>
              </TouchableHighlight>
            </View>
            <View>
              <EquipmentsTable
                items={equipmentData}
                width={"100%"}
                onEdit={(item, index)=>{
                  editReservationItem(item, index);
                }}
                onDelete={(item, index)=>{
                  removeReservationItem(item, index);
                }}
                isExtra={true}
                extraWith={350}
              />
            </View>
          </View>
        </div>
      </div>
      <AddTransactionModal
        isModalVisible={isAddTransactionModalVisible}
        nextStageProcessingStatus={nextStageProcessingStatus}
        customerId={customerId}
        reservationInfo = {reservationInfo}
        addCard={openAddCardModal}
        closeModal={closeAddTransactionModal}
        onAdded={(nextStageProcessingStatus)=>{
          if(nextStageProcessingStatus) processNextStage();
        }}
        continueWithouProcessing={()=>{
          if(nextStageProcessingStatus) processNextStage();
          closeAddTransactionModal();
        }}
      />
      <AddReservationItemModal
        isModalVisible={isAddReservationItemModalVisible}
        closeModal={closeAddReservationItemModal}
        item={editingItem}
        onAdded={(productFamily, quantity, extras)=>{
          if (productFamily) {
            addReservationItem(productFamily, quantity, extras);
          }
        }}
        onUpdated={(oldFamily, newFamily, quantity, extras)=>{
          if (newFamily) {
            updateReservationItem(oldFamily, newFamily, quantity, extras);
          }
          editReservationItem(null, null);
        }}
        isExtra={true}
      />
      <RefundStripeModal
        isModalVisible={isRefundStripeModalVisible}
        closeModal={closeRefundModal}
        refundDetails={refundDetails}
      />
      {Platform.OS === 'web' && (
        <AddCardModal
          isModalVisible={isAddCardModalVisible}
          customerId = {customerId}
          reservationId={reservationInfo?.id??null}
          closeModal={closeAddCardModal}
        />
      )}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </BasicLayout>
  );
};

const styles = proceedReservationStyle
