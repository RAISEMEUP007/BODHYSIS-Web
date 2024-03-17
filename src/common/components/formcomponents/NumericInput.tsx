import React, { useEffect, useState } from 'react';
import { TextInput, Text } from 'react-native';
import { TextValidationMsgSize } from '../../constants/Fonts';

const NumericInput = ({ validMinNumber = null, validMaxNumber = null, onChangeText, onBlur = null, value, ...rest }) => {
  const [inputValue, setInputValue] = useState(value);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    handleInputChange(value);
  }, [value]);

  const handleInputChange = (text) => {
    text = String(text);
    if (text == "") {
      setInputValue(text);
      setValidationMessage("");
    } else if (/^-?\d*\.?\d*$/.test(text)) {
      if (validMinNumber >= 0 && text.includes('-')) {
        setValidationMessage("Input must be a non-negative numeric value");
      } else if ((validMinNumber !== null && +text < validMinNumber) || (validMaxNumber !== null && +text > validMaxNumber)) {
        if (validMinNumber !== null && validMaxNumber !== null) {
          setValidationMessage(`Input must be a numeric value between ${validMinNumber} and ${validMaxNumber}`);
        } else if (validMinNumber !== null) {
          setValidationMessage(`Input must be a numeric value greater than or equal to ${validMinNumber}`);
        } else if (validMaxNumber !== null) {
          setValidationMessage(`Input must be a numeric value less than or equal to ${validMaxNumber}`);
        } else {
          setValidationMessage("");
        }
      } else {
        setInputValue(text);
        setValidationMessage("");
      }
    } else {
      setValidationMessage("Only numeric values are allowed");
    }
  
    if (onChangeText) {
      onChangeText(text);
    }
  }
  
  
  const handleInputBlur = () => {
    if (onBlur) {
      onBlur();
    }
  }

  return (
    <>
      <TextInput 
        style={styles.input} 
        value={inputValue} 
        onChangeText={handleInputChange} 
        onBlur={handleInputBlur}
        placeholderTextColor="#ccc"
        {...rest}
      />
      <Text style={styles.validationMessage}>
        {validationMessage}
      </Text>
    </>
  );
}

const styles = {
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 4,
    padding: 10,
    paddingHorizontal: 8,
  },
  validationMessage: {
    color: 'red',
    fontSize: TextValidationMsgSize,
    paddingLeft: 5,
    marginBottom: 10,
  }
}

export default NumericInput;
