import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, ActivityIndicator, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';

import {createPriceLogic, getPriceLogicData, deletePriceLogic, getSeasonsData, getBrandsData, getPriceTablesData } from '../../../api/Price';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';

import { priceLogicStyle } from './styles/PriceLogicStyle';

const PriceLogic = () => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [seasonId, setSeasonId] = useState(0);
  const [brandId, setBrandId] = useState(0);
  const [priceTableId, setPriceTableId] = useState(0);
  const [isLoading, setIsLoading] = useState(false); 
  const [BrandValidMessage, setBrandValidMessage] = useState('');
  const [SeasonValidMessage, setSeasonValidMessage] = useState('');
  const [PriceTableValidMessage, setPriceTableValidMessage] = useState('');

  const [updatePriceLogicTrigger, setUpdatePriceLogicTrigger] = useState(true);
  const [seasonData, setSeasonData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [priceTableData, setPriceTableData] = useState([]);
  
  const changeCellData = (index, key, newVal) => {
    const updatedTableData = [ ...tableData ];
    updatedTableData[index] = {
      ...updatedTableData[index],
      [key]: newVal 
    };
    setTableData(updatedTableData);
  };  

  const addPriceLogic = () => {
    if(!brandId || brandId == 0){
      setBrandValidMessage(msgStr('emptySelect'));
      return;
    }else if(!seasonId || seasonId == 0){
      setSeasonValidMessage(msgStr('emptySelect'));
      return;
    }else if(!priceTableId || priceTableId == 0){
      setPriceTableValidMessage(msgStr('emptySelect'));
      return;
    }

    setIsLoading(true);

    createPriceLogic(seasonId, brandId, priceTableId, (jsonRes, status, error)=>{
      switch(status){
        case 200:
          setUpdatePriceLogicTrigger(true);
          setSeasonId(0);
          setBrandId(0);
          setPriceTableId(0);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          setUpdatePriceLogicTrigger(true);
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
      setIsLoading(false);
    });
  }

  const removePriceLogic = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deletePriceLogic(id, (jsonRes, status, error)=>{
        switch(status){
          case 200:
            setUpdatePriceLogicTrigger(true);
            showAlert('success', jsonRes.message);
            break;
          default:
            if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      })
    });
  }

  useEffect(()=>{
    if(updatePriceLogicTrigger == true) {
      getTable();
      getSeasons();
      getBrands();
      getPriceTables();
    }
  }, [updatePriceLogicTrigger]);

  const getTable = () => {
    getPriceLogicData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setUpdatePriceLogicTrigger(false);
          setTableData(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  const getSeasons = () => {
    getSeasonsData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setSeasonData(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  const getBrands = () => {
    getBrandsData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setBrandData(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }
  
  const getPriceTables = () => {
    getPriceTablesData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setPriceTableData(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }

  const renderBrandPicker = () => {
    return (
      <View>
        <Picker
          selectedValue={brandId}
          style={styles.select}
          onValueChange={(itemValue, itemIndex) =>{
            setBrandId(itemValue);
            setBrandValidMessage('');
          }}
          placeholder='Select a brand'
        >
          <Picker.Item label="" value={0} />
          {brandData.map((item, index) => (
            <Picker.Item key={index} label={item.brand} value={item.id} />
          ))}
        </Picker>
        {(BrandValidMessage.trim() != '') && <Text style={styles.message}>{BrandValidMessage}</Text>}
      </View>
    );
  }

  const renderSeasonPicker = () => {
    return (
      <View>
        <Picker
          selectedValue={seasonId}
          style={styles.select}
          onValueChange={(itemValue, itemIndex) =>{
            setSeasonId(itemValue);
            setSeasonValidMessage('');
          }}>
          <Picker.Item label="" value={0} />
          {seasonData.map((item, index) => (
            <Picker.Item key={index} label={item.season} value={item.id} />
          ))}
        </Picker>
        {(SeasonValidMessage.trim() != '') && <Text style={styles.message}>{SeasonValidMessage}</Text>}
      </View>
    );
  }

  const renderPriceTablePicker = () => {
    return (
      <View>
        <Picker
          selectedValue={priceTableId}
          style={styles.select}
          onValueChange={(itemValue, itemIndex) =>{
            setPriceTableId(itemValue);
            setPriceTableValidMessage('');
          }}>
          <Picker.Item label="" value={0} />
          {priceTableData.map((item, index) => (
            <Picker.Item key={index} label={item.table_name} value={item.id} />
          ))}
        </Picker>
        {(PriceTableValidMessage.trim() != '') && <Text style={styles.message}>{PriceTableValidMessage}</Text>}
      </View>
    );
  }

  const renderTableData = () => {
    const rows = [];
    if(tableData.length > 0){
      tableData.map((item, index) => {
        rows.push( 
          <View key={index} style={styles.tableRow}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{item.brand?item.brand.brand:""}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{item.season?item.season.season:""}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{item.priceTable.table_name}</Text>
            </View>
            <View style={[styles.cell, styles.radioButtonCell]}>
              <TouchableOpacity onPress={()=>{removePriceLogic(item.id)}}>
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
    }else{
      <></>
    }
    return <>{rows}</>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarLabel}>Brands</Text>
        {renderBrandPicker()}
        <Text style={styles.toolbarLabel}>Seasons</Text>
        {renderSeasonPicker()}
        <Text style={styles.toolbarLabel}>Price Table</Text>
        {renderPriceTablePicker()}
        <TouchableHighlight style={styles.button} onPress={()=>{addPriceLogic()}}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>{"Brand"}</Text>
          <Text style={styles.columnHeader}>{"Season"}</Text>
          <Text style={styles.columnHeader}>{"Price Table"}</Text>
          <Text style={[styles.columnHeader, styles.radioButtonCell]}></Text>
        </View>
        <ScrollView>
            {renderTableData()}
        </ScrollView>
      </View>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = priceLogicStyle;

export default PriceLogic;