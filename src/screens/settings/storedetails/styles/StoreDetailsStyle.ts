import { StyleSheet } from 'react-native';
import { TextMediumSize, TextSmallSize } from '../../../../common/constants/Fonts';
import { TextdefaultSize } from '../../../../common/constants/Fonts';

export const StoreDetailsStyle = StyleSheet.create({
  label: {
    color: '#555',
    fontSize: TextSmallSize,
  },
  inputGroup: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 12,
    marginVertical: 16,
    borderRadius: 5,
  },
  inputGroupLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 8,
    marginBottom: 12,
    marginLeft: 12,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginHorizontal: 12,
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
  selectOption: {
    fontSize: 20,
  },
  deliveryButton: {
    marginLeft: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    textAlign: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#6c757d',
  },
  addButton: {
    backgroundColor: '#2e96e1',
    color: 'white',
    padding: 8,
    textAlign: 'center',
    width: 100,
    borderRadius: 5,
    marginBottom: 16,
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
  imagePicker: {
    position: 'relative',
    width: '100%',
    height: 280,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#80C0FF80',
    borderWidth: 2,
    borderStyle: 'solid',
    marginBottom: 10,
    marginTop: 4,
  },
  imageUpload: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preView: {
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  fileInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    Top: 0,
    opacity: 0,
    pointerEvents: 'none',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  boxText: {
    fontWeight: 'bold',
  },
  textarea: {
    height: TextdefaultSize * 6,
  },
});
