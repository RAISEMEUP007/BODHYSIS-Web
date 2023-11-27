import { StyleSheet } from 'react-native';
import { TextSmallSize } from '../../../../common/constants/Fonts';

export const priceModalstyles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
    width: 320,
  },
  select: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
  },
  addButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    borderRadius: 5,
  },
  message: {
    width: '100%',
    color: 'red',
    marginBottom: 0,
    marginTop: -10,
    fontSize: TextSmallSize,
    paddingLeft: 5,
  },
});