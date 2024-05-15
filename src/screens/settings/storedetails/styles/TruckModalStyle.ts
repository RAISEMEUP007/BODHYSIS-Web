import { StyleSheet } from 'react-native';
import { TextSmallSize, TextdefaultSize } from '../../../../common/constants/Fonts';

export const truckModalstyles = StyleSheet.create({
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
    width: 400,
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
  deliveryButton: {
    width: 140,
    marginTop: 20,
    padding: 8,
    textAlign: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#6c757d',
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
  imagePicker: {
    position: 'relative',
    width: '100%',
    height: 280,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#80C0FF80', // Warm color border with transparency
    borderWidth: 2, // Border width
    borderStyle: 'solid', // Border style
    marginVertical: 10,
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
