import { StyleSheet } from 'react-native';
import { TextMediumSize, TextSmallSize } from '../../../common/constants/Fonts';
import { TextdefaultSize } from '../../../common/constants/Fonts';

export const equipmentsTableStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  tableContainer: {
    marginBottom: 16,
    marginTop: 6,
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
  table: {
    borderWidth: 0,
    borderColor: '#ddd',
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  columnHeader: {
    fontWeight: 'bold',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: 200,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  cell: {
    position: 'relative',
    width: 200,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  cellInput: {
    width: 150,
    paddingHorizontal: 6,
    paddingVertical: 6,
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
  headerIcon: {
    position: 'absolute',
    left: 0,
    width: '100%',
    alignItems: 'center',
    top: -26,
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
    width: '100%',
    height: 50,
    resizeMode: 'contain',
  },
});
