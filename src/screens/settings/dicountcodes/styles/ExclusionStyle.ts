import { StyleSheet } from 'react-native';
import { TextMediumSize, TextSmallSize } from '../../../../common/constants/Fonts';
import { TextdefaultSize } from '../../../../common/constants/Fonts';

export const exclusionStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 32,
  },
  tableContainer: {
    marginBottom: 16,
    marginTop: 10,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: '#bfbfbf',
    borderLeftWidth: 1,
    borderLeftColor: '#06685ea3',
    borderRightWidth: 1,
    borderRightColor: '#06685ea3',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  etoolbar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 10,
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
    paddingHorizontal: 8,
    paddingVertical: 6,
    // fontSize: TextdefaultSize,
    width: 200,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  cell: {
    position: 'relative',
    padding: 2,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: TextdefaultSize,
    width: 200,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  focusedCell: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cellcheckbox: {
    width: 60,
    textAlign: 'center',
    alignItems: 'center',
  },
  groupCell: {
    width: 250,
    paddingHorizontal: 12,
    justifyContent: 'center',
    textAlign: 'left',
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
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  deliveryButton: {
    width: 140,
    marginTop: 20,
    padding: 6,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#6c757d',
  },
});
