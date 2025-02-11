import { StyleSheet } from 'react-native';
import { TextSmallSize, TextdefaultSize } from '../../../common/constants/Fonts';
import { Colors } from '../../../common/constants/Colors';

export const createReservationStyle = StyleSheet.create({
  outterContainer: {
    marginVertical: 30,
    paddingVertical: 40,
    paddingHorizontal: 60,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor:'#b3b3b3',
    shadowColor:'#999',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.Neutrals.WHITE,
  },
  reservationRow: {
    flexDirection: 'row',
    flexWrap:'wrap',
    marginVertical: 8,
    justifyContent:'space-between',
    gap:8,
    // paddingVertical: 8,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  equipmentText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 15,
  },
  width: {
    flexDirection: 'row',
  },
  modal: {
    padding: 20,
  },
  selectDateModalText: {
    fontSize: 20,
    marginBottom: 5,
  },
  bottomContainer: {
    paddingHorizontal: 20,
  },
  input:{
    boxSizing: 'border-box',
    padding:8,
    fontSize:14,
    width:350,
    borderWidth:1, 
    borderColor:'#808080',
    // height: 37,
  },
  dateInput:{
    padding:8,
    fontSize:14,
    width:233,
    borderWidth:1, 
    borderColor:'#808080',
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 10,
    color: 'white',
  },
  button: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 300,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 0,
    borderColor: '#6c757d',
    backgroundColor: '#2e96e1',
  },
  addItemButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 0,
    borderColor: '#6c757d',
    backgroundColor: '#2e96e1',
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
