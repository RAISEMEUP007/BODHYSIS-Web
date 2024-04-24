import { StyleSheet } from 'react-native';
import { TextSmallSize, TextdefaultSize } from '../../../../common/constants/Fonts';

export const addTransactionModaltyles = StyleSheet.create({
  label: {
    color: '#555',
    fontSize: TextSmallSize,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 8,
  },
  inputDisable: {
    borderColor: '#ddd',
  },
  select: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 10,
    padding: 8,
  },
  addButton: {
    backgroundColor: '#2e96e1',
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
    borderRadius: 5,
    marginLeft:10,
    borderWidth:2, 
    borderColor:'#2e96e1',
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
  textarea: {
    height: TextdefaultSize * 6,
  },
  outLineButton: {
    alignItems: 'center',
    justifyContent:'center',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#6c757d',
    marginLeft: 13,
    // fontFamily: 'san'
  },
  outlineBtnText: {
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
    // color:'#6c757d',
    // marginLeft: 10,
  },
});
