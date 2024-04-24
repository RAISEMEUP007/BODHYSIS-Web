import { StyleSheet } from 'react-native';
import { TextSmallSize, TextdefaultSize } from '../../../../../common/constants/Fonts';

export const productFamilyModalstyles = StyleSheet.create({
  label: {
    color: '#555',
    fontSize: TextSmallSize,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 10,
    padding: 8,
    width: '100%',
  },
  select: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 4,
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
    width: '100%',
    height: 260,
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
    height: 200,
  },
  richTextContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    width: '100%',
    marginBottom: 10,
  },

  richTextEditorStyle: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: '#ccaf9b',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },

  richTextToolbarStyle: {
    backgroundColor: '#c6c3b3',
    borderColor: '#c6c3b3',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
  },
});
