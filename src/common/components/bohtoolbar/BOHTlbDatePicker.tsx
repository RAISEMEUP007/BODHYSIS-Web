import React, { InputHTMLAttributes, forwardRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DatePicker from 'react-datepicker';

const renderBOHTlbDatePicker = (selectedDate, onChangeHandler, inputStyle={}) => {
  const CustomInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ value, onChange, onClick }, ref) => {
      return (
        <input
          onClick={onClick}
          onChange={(val)=>{onChange(val)}}
          ref={ref}
          style={{...styles.dateInput, ...inputStyle}}
          defaultValue={value}
        ></input>
      )
    }
  );

  let sDate;
  if(selectedDate){
    const dateParts = selectedDate.split('-');
    sDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  }else{
    sDate = null;
  }
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
    textAlign: 'center',
    paddingTop:6,
    paddingBottom:4,
    fontSize:16,
    width:100,
    borderColor:'#808080',
  },
});

export default renderBOHTlbDatePicker;