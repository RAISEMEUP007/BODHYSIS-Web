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
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 3,
    borderWidth: 0,
    borderColor: '#6c757d',
    backgroundColor: '#0EA4AF',
  },
  buttonText: {
    fontSize: 14,
    letterSpacing: 1,
    marginLeft: 10,
    color: 'white',
  },
  outLineButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#6c757d',
    marginLeft: 13,
  },
  outlineBtnText: {
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
    // color:'#6c757d',
    // marginLeft: 10,
  },
});
