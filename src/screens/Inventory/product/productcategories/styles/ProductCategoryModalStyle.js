import { StyleSheet } from 'react-native';
import { TextSmallSize } from '../../../../../common/constants/Fonts';

export const productCategoryModalstyles = StyleSheet.create({
  label: {
    color: "#555",
    fontSize: TextSmallSize,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 10,
    padding: 8,
    width: 400,
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
    backgroundColor: 'blue',
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
    width: 400,
    height: 300,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  imageUpload: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
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
    width: '100%',
    height: '100%',
    Top: 0,
    opacity: 0,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  boxText: {
    fontWeight: 'bold',
  },
});