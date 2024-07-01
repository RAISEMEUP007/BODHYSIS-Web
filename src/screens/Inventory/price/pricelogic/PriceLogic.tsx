import React, { useEffect, useState, forwardRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';

import {
  createPriceLogic,
  getPriceLogicData,
  deletePriceLogic,
  getSeasonsData,
  getBrandsData,
  getPriceTablesData,
} from '../../../../api/Price';
import { msgStr } from '../../../../common/constants/Message';
import { TextMediumSize, TextSmallSize, TextdefaultSize } from '../../../../common/constants/Fonts';
import { useAlertModal, useConfirmModal } from '../../../../common/hooks';
import BasicLayout from '../../../../common/components/CustomLayout/BasicLayout';

import { CommonContainer } from '../../../../common/components/CustomLayout';
import { BOHButton, BOHToolbar, renderBOHTlbDatePicker } from '../../../../common/components/bohtoolbar';
import { BOHTBody, BOHTD, BOHTDIconBox, BOHTH, BOHTHead, BOHTR, BOHTable } from '../../../../common/components/bohtable';
import { formatDate } from '../../../../common/utils/DateUtils';
import { TextStyle } from 'react-native';

const PriceLogic = ({ navigation, openInventory }) => {

  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const initWidth = [200, 200, 200, 120, 120, 50]
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

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const changeCellData = (index, key, newVal) => {
    const updatedTableData = [...tableData];
    updatedTableData[index] = {
      ...updatedTableData[index],
      [key]: newVal,
    };
    setTableData(updatedTableData);
  };

  const addPriceLogic = () => {
    if (!brandId || brandId == 0) {
      setBrandValidMessage(msgStr('emptySelect'));
      return;
    } else if (!seasonId || seasonId == 0) {
      setSeasonValidMessage(msgStr('emptySelect'));
      return;
    } else if (!priceTableId || priceTableId == 0) {
      setPriceTableValidMessage(msgStr('emptySelect'));
      return;
    }

    setIsLoading(true);

    const payload = {
      seasonId,
      brandId,
      tableId: priceTableId,
      startDate,
      endDate,
    };

    createPriceLogic(payload, (jsonRes, status, error) => {
      switch (status) {
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
          if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
      setIsLoading(false);
    });
  };

  const removePriceLogic = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), () => {
      deletePriceLogic(id, (jsonRes, status, error) => {
        switch (status) {
          case 200:
            setUpdatePriceLogicTrigger(true);
            showAlert('success', jsonRes.message);
            break;
          default:
            if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      });
    });
  };

  useEffect(() => {
    if (updatePriceLogicTrigger == true) {
      getTable();
      getSeasons();
      getBrands();
      getPriceTables();
    }
  }, [updatePriceLogicTrigger]);

  const getTable = () => {
    getPriceLogicData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setUpdatePriceLogicTrigger(false);
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

  const getSeasons = () => {
    getSeasonsData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setSeasonData(jsonRes);
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

  const getBrands = () => {
    getBrandsData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setBrandData(jsonRes);
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

  const getPriceTables = () => {
    getPriceTablesData((jsonRes, status, error) => {
      switch (status) {
        case 200:
          setPriceTableData(jsonRes);
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

  const renderBrandPicker = () => {
    return (
      <View>
        <Picker
          selectedValue={brandId}
          style={styles.select}
          onValueChange={(itemValue, itemIndex) => {
            setBrandId(itemValue);
            setBrandValidMessage('');
          }}
          placeholder="Select a brand"
        >
          <Picker.Item label="" value={0} />
          {brandData.map((item, index) => (
            <Picker.Item key={index} label={item.brand} value={item.id} />
          ))}
        </Picker>
        {BrandValidMessage.trim() != '' && <Text style={styles.message}>{BrandValidMessage}</Text>}
      </View>
    );
  };

  const renderSeasonPicker = () => {
    return (
      <View>
        <Picker
          selectedValue={seasonId}
          style={styles.select}
          onValueChange={(itemValue, itemIndex) => {
            setSeasonId(itemValue);
            setSeasonValidMessage('');
          }}
        >
          <Picker.Item label="" value={0} />
          {seasonData.map((item, index) => (
            <Picker.Item key={index} label={item.season} value={item.id} />
          ))}
        </Picker>
        {SeasonValidMessage.trim() != '' && (
          <Text style={styles.message}>{SeasonValidMessage}</Text>
        )}
      </View>
    );
  };

  const renderPriceTablePicker = () => {
    return (
      <View>
        <Picker
          selectedValue={priceTableId}
          style={styles.select}
          onValueChange={(itemValue, itemIndex) => {
            setPriceTableId(itemValue);
            setPriceTableValidMessage('');
          }}
        >
          <Picker.Item label="" value={0} />
          {priceTableData.map((item, index) => (
            <Picker.Item key={index} label={item.table_name} value={item.id} />
          ))}
        </Picker>
        {PriceTableValidMessage.trim() != '' && (
          <Text style={styles.message}>{PriceTableValidMessage}</Text>
        )}
      </View>
    );
  };

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <BOHTR key={index}>
            <BOHTD width={initWidth[0]}>{item.brand ? item.brand.brand : ''}</BOHTD>
            <BOHTD width={initWidth[1]}>{item.season ? item.season.season : ''}</BOHTD>
            <BOHTD width={initWidth[2]}>{item.priceTable.table_name}</BOHTD>
            <BOHTD width={initWidth[3]}>{item.start_date}</BOHTD>
            <BOHTD width={initWidth[4]}>{item.end_date}</BOHTD>
            <BOHTDIconBox width={initWidth[5]}>
              <TouchableOpacity
                onPress={() => {
                  removePriceLogic(item.id);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
            </BOHTDIconBox>
          </BOHTR>
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
      goBack={() => {
        openInventory(null);
      }}
      screenName={'Price logic'}
      isLoading={isLoading}
    >
      <CommonContainer>
        <BOHToolbar>
          <Text style={styles.toolbarLabel}>Brands</Text>
          {renderBrandPicker()}
          <Text style={styles.toolbarLabel}>Seasons</Text>
          {renderSeasonPicker()}
          <Text style={styles.toolbarLabel}>Price table</Text>
          {renderPriceTablePicker()}
          <BOHButton
            label="Create"
            onPress={addPriceLogic}/>
        </BOHToolbar>
        <BOHToolbar style={{zIndex:100}}>
          <Text style={styles.toolbarLabel}>Start date</Text>
          {Platform.OS == 'web' && renderBOHTlbDatePicker(startDate, date=>setStartDate(formatDate(date)), styles.input)}
          <Text style={styles.toolbarLabel}>End date</Text>
          {Platform.OS == 'web' && renderBOHTlbDatePicker(endDate, date=>setEndDate(formatDate(date)), styles.input)}
        </BOHToolbar>
        <BOHTable>
          <BOHTHead>
            <BOHTR>
              <BOHTH width={initWidth[0]}>{'Brand'}</BOHTH>
              <BOHTH width={initWidth[1]}>{'Season'}</BOHTH>
              <BOHTH width={initWidth[2]}>{'Price table'}</BOHTH>
              <BOHTH width={initWidth[3]}>{'Start date'}</BOHTH>
              <BOHTH width={initWidth[4]}>{'End date'}</BOHTH>
              <BOHTH width={initWidth[5]}>{'DEL'}</BOHTH>
            </BOHTR>
          </BOHTHead>
          <BOHTBody>
            {renderTableData()}
          </BOHTBody>
        </BOHTable>
      </CommonContainer>
    </BasicLayout>
  );
};

interface Styles {
  toolbarLabel: TextStyle;
  select: TextStyle;
  message: TextStyle;
  input: any;
}

const styles:Styles = {
  toolbarLabel: {
    fontSize: TextdefaultSize,
    margin: 5,
    paddingVertical: 5,
  },
  select: {
    margin: 5,
    fontSize: TextdefaultSize,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 3,
    width: 180,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 20,
  },
  message: {
    position: 'absolute',
    bottom: -15,
    left: 10,
    width: '100%',
    color: 'red',
    fontSize: TextSmallSize,
  },
  input: {
    width: 150,
    // padding: '0.375rem 0.rem',
    padding: 6,
    height: 17,
    fontSize: TextdefaultSize,
    lineHeight: 1.5,
    color: '#495057',
    backgroundColor: '#fff',
    backgroundClip: 'padding-box',
    border: '1px solid #ced4da',
    borderRadius: 3,
    marginRight:21,
    transition: 'border-color .15s ease-in-out, box-shadow 0.15s-in-out',
  },
};

export default PriceLogic;
