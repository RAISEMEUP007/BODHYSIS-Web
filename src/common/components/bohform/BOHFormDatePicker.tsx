import React, { InputHTMLAttributes, forwardRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DatePicker from 'react-datepicker';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'react-datepicker/dist/react-datepicker.css';
  document.head.appendChild(link);
}

const renderBOHFormDatePicker = (selectedDate, onChangeHandler) => {
  const CustomInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ value, onChange, onClick }, ref) => {
      return (
        <input
          onClick={onClick}
          onChange={(val)=>{onChange(val)}}
          ref={ref}
          style={styles.dateInput}
          defaultValue={value}
        ></input>
      )
    }
  );

  const dateParts = selectedDate.split('-');
  const sDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  return (
    <View style={{zIndex:10}}>
      <DatePicker
        selected={sDate}
        onChange={(date) => {
          onChangeHandler(date)
        }}
        customInput={<CustomInput />}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        dateFormat="MM/dd/yyyy"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dateInput:{
    borderTopWidth:0,
    borderRightWidth:0,
    borderBottomWidth:1,
    borderLeftWidth:0,
    textAlign: 'left',
    paddingTop:6,
    paddingBottom:4,
    padding:8,
    paddingVertical:10,
    fontSize:14,
    width:"100%",
    height:40,
    borderWidth:1, 
    borderColor:'#808080',
    boxSizing:'border-box',
  },
});

export default renderBOHFormDatePicker;