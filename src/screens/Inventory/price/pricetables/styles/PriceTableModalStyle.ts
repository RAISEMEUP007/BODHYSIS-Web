import { StyleSheet } from 'react-native';
import { TextSmallSize } from '../../../../../common/constants/Fonts';

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
    backgroundColor: '#2e96e1',
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
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});