import { StyleSheet } from 'react-native';
import { TextMediumSize, TextSmallSize } from '../../../../common/constants/Fonts';
import { TextdefaultSize } from '../../../../common/constants/Fonts';

export const priceLogicStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 32,
  },

  input: {
    width: 150,
    padding: '0.375rem 0.rem',
    fontSize: TextdefaultSize,
    lineHeight: '1.5',
    color: '#495057',
    background: '#fff',
    backgroundClip: 'padding-box',
    border: '1px solid #ced4da',
    borderRadius: '.25rem',
    transition: 'border-color .15s ease-in-out, box-shadow 0.15s-in-out',
  },

  tableContainer: {
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 1,
  },
 
  buttonText: {
    fontSize: TextSmallSize,
    color: 'white',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingVertical: TextSmallSize/2,
    paddingHorizontal: TextSmallSize,
    margin: 5,
  },
  toolbarLabel: {
    fontSize: TextdefaultSize,
    margin: 5,
    paddingVertical: 5,
  }, 
  select: {
    margin: 5,
    fontSize: TextdefaultSize,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    width: 150,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 20,
  },

  table: {
    borderWidth: 0,
    borderColor: '#ddd',
    flexDirection: 'column',
  },
  tableHeader: {
    marginTop: 10,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderLeftWidth: 1,
    borderLeftColor: '#06685ea3',
    borderRightWidth: 1,
    borderRightColor: '#06685ea3',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderLeftWidth: 1,
    borderLeftColor: '#06685ea3',
    borderRightWidth: 1,
    borderRightColor: '#06685ea3',
  },
  columnHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: 200,
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
  cell: {
    position: 'relative',
    padding: 2,
    width: 200,
    alignItems: 'flex-start',
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
  cellText: {
    width: 150,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateCell: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedCell: {
    borderWidth: 1,
    borderColor: "#ccc",
  }, 
  cellcheckbox: {
    width: 60,
    textAlign: 'center',
    alignItems: 'center',
  },
  groupCell: {
    width: 250, 
    paddingHorizontal: 12,
    justifyContent: "center",
    textAlign:'left',
  },
  headerIcon: {
    position:'absolute', 
    left:0, 
    width:'100%', 
    alignItems:'center', 
    top:-26
  },
  deleteRow: {
    position: 'absolute',
    right: 5,
    top: 3,
  },
  editRow: {
    position: 'absolute',
    right: TextMediumSize * 1.5,
    top: -20,
  },
  radioButtonCell: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
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
  message: {
    position: 'absolute',
    bottom: -15,
    left: 10,
    width: '100%',
    color: 'red',
    fontSize: TextSmallSize,
  },
});