import React, { useEffect, useState, useRef } from 'react';
import {  ScrollView,  View,  Text,  TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { TextMediumSize } from '../../common/constants/Fonts';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';

import { equipmentsTableStyle } from './styles/EquipmentsTableStyle';

interface Props {
  items: any;
}

const EquipmentsTable =  ({ items }: Props) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  const scrollViewRef = useRef();
  
  const [tableData, setTableData] = useState([]);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(()=>{
    if(items && items.length && items.length > 0){
      setTableData(items);
    }else{
      setTableData([]);
    }
  }, [items])

  const renderTableData = () => {
    const rows = [];
    if (tableData.length > 0) {
      tableData.map((item, index) => {
        rows.push(
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, {width:60, alignItems:'flex-end'}]}>
              <Text>{(index + 1)}</Text>
            </View>
            <View style={[styles.cell, {flex:1}]}>
              <Text>{item.line}</Text>
            </View>
            <View style={[styles.cell, { width: 100, paddingRight: 6, alignItems: 'flex-end' }]}>
              <Text>{item.quantity ? item.quantity : '0'}</Text>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {

                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {

                }}
              >
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
    } else {
      <></>;
    }
    return <>{rows}</>;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.tableContainer, {width:740}]}>
        <View style={[styles.tableHeader, { paddingRight: 738 - contentWidth }]}>
          <Text style={[styles.columnHeader, { width: 60 }]}>{'No'}</Text>
          <Text style={[styles.columnHeader, { flex:1 }]}>{'Product Line'}</Text>
          <Text style={[styles.columnHeader, { width: 100 }]}>{'Quantity'}</Text>
          {/* <Text style={[styles.columnHeader, { width: 100 }]}>{'Price'}</Text> */}
          <Text style={[styles.columnHeader, styles.IconCell]}>{'Edit'}</Text>
          <Text style={[styles.columnHeader, styles.IconCell]}>{'DEL'}</Text>
        </View>
        <ScrollView
          onContentSizeChange={(width, height) => {
            setContentWidth(width);
          }}
          style={{ height:300}}>
          {renderTableData()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = equipmentsTableStyle;

export default EquipmentsTable;
