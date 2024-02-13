import { StyleSheet } from 'react-native';
import { TextMediumSize, TextSmallSize } from '../../../common/constants/Fonts';
import { TextdefaultSize } from '../../../common/constants/Fonts';
import { Colors } from '../../../common/constants/Colors';

export const proceedReservationStyle = StyleSheet.create({
  topContainer: {alignItems:'center'},
  container: {
    marginVertical: 30,
    paddingVertical: 40,
    paddingHorizontal: 60,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  nextStageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 3,
    borderWidth: 0,
    borderColor: '#6c757d',
    backgroundColor: '#0EA4AF',
  },
  buttonText: {
    fontSize: 14,
    // letterSpacing: 1,
    fontFamily: 'monospace',
    marginLeft: 10,
    color: 'white',
  },
  outLineButton: {
    justifyContent:'center',
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#6c757d',
    marginLeft: 13,
    fontFamily: 'san'
  },
  outlineBtnText: {
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
    // color:'#6c757d',
    // marginLeft: 10,
  },
  reservationRow: {
    flexDirection: 'row',
    flexWrap:'wrap',
    marginBottom: 2,
    // paddingVertical: 8,
  },
  addItemButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 0,
    borderColor: '#6c757d',
    backgroundColor: '#007BFF',
  },
});
