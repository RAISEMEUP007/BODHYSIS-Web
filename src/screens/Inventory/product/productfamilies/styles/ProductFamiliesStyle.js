import { StyleSheet } from 'react-native';
import { TextMediumSize, TextSmallSize } from '../../../../../common/constants/Fonts';
import { TextdefaultSize } from '../../../../../common/constants/Fonts';

export const productFamiliesStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 32,
  },

  tableContainer: {
    borderRadius: 4,
    marginBottom: 16,
    marginTop: 10,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
    justifyContent: 'center',
  },
  cellInput: {
    width: 150,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryCell: {
    width: 400,
    paddingHorizontal: 6,
    paddingVertical: 6,
    justifyContent: "center",
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
  IconCell: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  imageCell: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  cellImage: { 
    width: "100%", 
    height: 50, 
    resizeMode: 'contain'
  },
  familyRow: {
    marginLeft: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderLeftWidth: 1,
    borderLeftColor: '#06685ea3',
    borderRightWidth: 1,
    borderRightColor: '#06685ea3',
  },
  familyIconCell: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});