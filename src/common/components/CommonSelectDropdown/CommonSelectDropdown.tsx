import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, ViewStyle } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import { Colors } from '../../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

export type DropdownItem<T> = {
  value: T;
  displayLabel: string;
  secondaryLabel?: string;
  index: number;
};

export type DropdownData<T> = Array<DropdownItem<T>>;

interface Props<T> {
  data: DropdownData<T>;
  isCollpased?: boolean;
  placeholder?: string;
  onItemSelected?: (item: DropdownItem<T>) => void;
  containerStyle?: ViewStyle;
  width?: number;
  title?: string;
  textAlign?: 'left' | 'center' | 'right' | 'auto';
  defaultValue?;
}

export const CommonSelectDropdown = ({
  data,
  placeholder = '',
  containerStyle,
  onItemSelected,
  width = 130,
  title,
  textAlign = 'left',
  defaultValue,
}: Props<any>) => {

  const [selectedItem, setSelectedItem] = useState<DropdownItem<any> | null>(null);
  const [filteredData, setFilteredData] = useState<DropdownData<any>>(data);

  useEffect(() => {
    if (defaultValue) {
      setSelectedItem(defaultValue);
    }
  }, [defaultValue]);

  useEffect(()=>{
    setFilteredData(data);
  }, [data])

  const renderTitle = () => {
    if (!title) {
      return null;
    }
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };

  const renderData = () => {
    return (
      <View style={{
      }}>
        <SelectDropdown
          // ref={selectDropdownRef}
          data={filteredData}
          search={true}
          defaultButtonText={selectedItem?selectedItem.displayLabel : placeholder}
          // buttonStyle={{width:'100%', padding: 8, height:'auto', borderWidth:1, borderColor:'#808080', backgroundColor:(selectedItem?'#f4ffff':'white')}}
          buttonStyle={{width:'100%', padding: 8, height:'auto', borderWidth:1, borderColor:'#808080', backgroundColor:'white'}}
          buttonTextStyle={{fontSize:14, textAlign: textAlign, color:(selectedItem?'#002133':'#bfbfbf')}}
          renderDropdownIcon={()=>{
            return <FontAwesome5 name="chevron-down" color="black" />
          }}
          searchInputStyle={{padding: 8, }}
          searchInputTxtStyle={{fontSize:14, padding:8, borderWidth:1, borderColor:'#808080'}}
          rowStyle = {{padding: 6}}
          rowTextStyle = {{textAlign:'left', paddingLeft:8, fontSize:14}}
          selectedRowStyle = {{backgroundColor: '#b2d7d7'}}

          onFocus={()=>{
            // setFilteredData(data);
          }}
          onSelect={(selectedItem, index) => {
            setSelectedItem(selectedItem);
            if (onItemSelected) {
              onItemSelected(selectedItem as any);
            }
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.displayLabel
          }}
          rowTextForSelection={(item, index) => {
            return item.displayLabel
          }}
          onBlur={()=>{
            setFilteredData(data);
          }}
          onChangeSearchInputText={(txt)=>{
            if(txt != '' && txt.trim() != ''){
              const filteredData = data.filter((item) =>
                item.displayLabel.toLowerCase().includes(txt.toLowerCase())
              );
              setFilteredData(filteredData);

              if(filteredData.length>0){
                // setSelectedItem(filteredData[0]);
                // selectDropdownRef.current.selectIndex(0);
              }
            }else setFilteredData(data);
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ ...containerStyle, width, backgroundColor: Colors.Neutrals.WHITE }}>
      {renderTitle()}
      {renderData()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.Neutrals.LIGHT_GRAY,
  },
  headerText: {
    fontSize: 16,
    // fontWeight: '600',
  },
  title: {
    fontSize: 16,
    // fontWeight: '600',
    marginBottom: 10,
  },
  item: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: Colors.Neutrals.LIGHT_GRAY,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    padding: 10,
  },
  itemSelected: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: Colors.Neutrals.LIGHT_GRAY,
    padding: 10,
  },
  secondaryLabel: {
    flex: 1,
    flexDirection: 'row',
  },
});
