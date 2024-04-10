import { StyleSheet } from 'react-native';
import { TextMediumSize, TextSmallSize } from '../../../common/constants/Fonts';
import { TextdefaultSize } from '../../../common/constants/Fonts';

export const reservationMainInfoStyle = StyleSheet.create({
  reservationRow: {
    flexDirection: 'row',
    flexWrap:'wrap',
    marginVertical: 10,
    // paddingVertical: 8,
  },
  input:{
    boxSizing: 'border-box',
    padding:8,
    fontSize:14,
    width:300,
    borderWidth:1, 
    borderColor:'#808080',
    // height: 37,
    marginRight: 30,
  },
  text:{
    boxSizing: 'border-box',
    padding:8,
    paddingVertical:10,
    fontSize:14,
    width:300,
    borderWidth:1, 
    borderColor:'#808080',
    // height: 37,
    marginRight: 30,
  },
});
