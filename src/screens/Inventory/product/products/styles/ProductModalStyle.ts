import { StyleSheet } from 'react-native';
import { TextSmallSize, TextdefaultSize } from '../../../../../common/constants/Fonts';

export const productModalstyles = StyleSheet.create({
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
    width: 500,
  },
  inputDisable: {
    borderColor: "#ddd",
  },
  select: {
    width: 500,
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
    width: "100%",
    height: 280,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#80C0FF80', // Warm color border with transparency
    borderWidth: 2, // Border width
    borderStyle: 'solid', // Border style
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
  textarea: {
    height: 114,
  }
});