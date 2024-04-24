import { StyleSheet } from 'react-native';
import { TextMediumSize, TextSmallSize } from '../../../../../common/constants/Fonts';
import { TextdefaultSize } from '../../../../../common/constants/Fonts';

export const productsStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    padding: 38,
    paddingTop: 28,
    paddingBottom:0,
  },

  tableContainer: {
    flex:1,
    flexDirection:'column',
    marginBottom: 16,
    marginTop: 10,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: '#bfbfbf',
    borderLeftWidth: 1,
    borderLeftColor: '#bfBFbf',
    borderRightWidth: 1,
    borderRightColor: '#bfBFbf',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
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
    backgroundColor: '#2e96e1',
    borderRadius: 4,
    paddingVertical: TextSmallSize/2,
    paddingHorizontal: TextSmallSize,
    margin: 5,
  },
  bulkbutton: {
    backgroundColor: '#17A2B8',
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
    width: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 20,
  },
  searchLabel: {
    marginHorizontal: 10,
    fontSize: TextdefaultSize,
    width:80,
    textAlign:'right',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    fontSize: TextSmallSize,
    width: 240,
  },
  searchPicker: {
    minWidth: 240,
  },

  table: {
    borderWidth: 0,
    borderColor: '#ddd',
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  columnHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: 150,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  cell: {
    position: 'relative',
    padding: 10,
    width: 150,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 14,
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
    borderLeftColor: '#bfBFbf',
    borderRightWidth: 1,
    borderRightColor: '#bfBFbf',
  },
  familyIconCell: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  sortableColumn: {
    flexDirection:'row', 
    alignItems:'center',
    justifyContent: 'space-between',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    opacity: 0.4
  }
});