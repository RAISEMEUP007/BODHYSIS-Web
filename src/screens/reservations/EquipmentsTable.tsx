import React, { useEffect, useState, useRef } from 'react';
import {  ScrollView,  View,  Text,  TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Tooltip } from 'react-native-paper';

import { TextMediumSize } from '../../common/constants/Fonts';
import { useAlertModal } from '../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../common/hooks/UseConfirmModal';

import { equipmentsTableStyle } from './styles/EquipmentsTableStyle';

interface Props {
  items: any;
  onEdit?: (item, index) => void;
  onDelete?: (item, index) => void;
  width?: number;
  isExtra? : boolean;
  extraWith? : number;
}

const EquipmentsTable =  ({ items, onEdit, onDelete, width, isExtra, extraWith }: Props) => {
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();
  const scrollViewRef = useRef();
  
  const [tableData, setTableData] = useState([]);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(()=>{
    if(items && items.length && items.length > 0){
      if(typeof(items) == 'string')
      items = JSON.parse(items);
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
              <Text>{item.line + " " + item.size}</Text>
            </View>
            <View style={[styles.cell, { width: 100, paddingRight: 6, alignItems: 'flex-end' }]}>
              <Text>{item.quantity ? item.quantity : '0'}</Text>
            </View>
            <View style={[styles.cell, { width: 100, paddingRight: 6, alignItems: 'flex-end' }]}>
              <Text>{(item.price ? item.price : 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
            </View>
            {isExtra && (
              <View style={[styles.cell, { width: extraWith || 400, flexDirection:'row', alignItems:'center', justifyContent:'flex-start', paddingVertical:2, paddingHorizontal:6}]}>
              {item && item.extras && item.extras.map((extra, index) => (
                <Tooltip key={index} title={extra.name} enterTouchDelay={100} leaveTouchDelay={100}>
                  <View style={{borderWidth:1, borderColor:'#ccc', margin:4, paddingTop: 1, paddingBottom:4, paddingHorizontal:8, borderRadius:10, maxWidth:110, backgroundColor:'#6B3FA0'}}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{color:'white'}}>
                      {extra.name}
                    </Text>
                  </View>
                </Tooltip>
              ))}
              </View>
            )}
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  if(onEdit) onEdit(item, index);
                }}
              >
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity
                onPress={() => {
                  if(onDelete) onDelete(item, index);
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
      <View style={[styles.tableContainer, {width:width || 740}]}>
        <View style={[styles.tableHeader, { paddingRight: 738 - contentWidth }]}>
          <Text style={[styles.columnHeader, { width: 60 }]}>{'No'}</Text>
          <Text style={[styles.columnHeader, { flex:1 }]}>{'Product Line'}</Text>
          <Text style={[styles.columnHeader, { width: 100 }]}>{'Quantity'}</Text>
          <Text style={[styles.columnHeader, { width: 100 }]}>{'Price'}</Text>
          {isExtra && (
            <Text style={[styles.columnHeader, { width: extraWith || 400 }]}>{'Extras'}</Text>
          )}
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
