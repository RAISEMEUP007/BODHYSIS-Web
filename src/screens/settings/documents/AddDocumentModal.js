import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Platform, Image } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Editor } from 'primereact/editor';
import { Document, Page, pdfjs } from 'react-pdf';

import { createDocument, updateDocument } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import NumericInput from '../../../common/components/formcomponents/NumericInput';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { documentModalstyles } from './styles/DocumentModalStyle';
import { API_URL } from '../../../common/constants/AppConstants';

const AddDocumentModal = ({ isModalVisible, Document, setUpdateDocumentTrigger, closeModal }) => {
  const isUpdate = Document ? true : false;
  const inputRef = useRef(null);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [DocumentNameTxt, setDocumentNameTxt] = useState('');
  const [documentType, setDocumentType] = useState(0);
  const [documentContentTxt, setDocumentContentTxt] = useState('');

  useEffect(() => {
    if(Platform.web){
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [closeModal]);

  useEffect(() => {
    if(isModalVisible){
      if(Document){
        setDocumentNameTxt(Document.document_name);
        setDocumentType(Document.document_type);
        setDocumentContentTxt(Document.document_content);
        setImagePreviewUrl(API_URL + Document.document_file);
      }else{
        setDocumentNameTxt('');
        setDocumentType(0);
        setDocumentContentTxt('');
        setImagePreviewUrl(null);
      }
      setSelectedImage(null);
    }else{
      setDocumentType(-1);
    }
  }, [isModalVisible])

  const handleImageSelection = (event) => {
    const file = Platform.OS === 'web' ? event.target.files[0] : event.nativeEvent.target.files[0];
    
    if (file.type !== "application/pdf") {
      showAlert('error', 'Please select a PDF file');
      return;
    }
  
    const imagePreviewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreviewUrl(imagePreviewUrl); 
  };

  const AddButtonHandler = () => {
    if (!DocumentNameTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } 
    
    setIsLoading(true);

    const formData = new FormData();
    formData.append('document_name', DocumentNameTxt);
    formData.append('document_type', documentType);
    if(selectedImage) formData.append('img', selectedImage);
    formData.append('document_content', documentContentTxt);

    const handleResponse = (jsonRes, status) => {
      switch(status){
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateDocumentTrigger(true);
          closeModal();
          break;
        case 409:
          setValidMessage(jsonRes.error);
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          closeModal();
          break;
      }
      setIsLoading(false);
    };
    
    if (isUpdate) {
      formData.append('id', Document.id);
      updateDocument(formData, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createDocument(formData, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const closeModalhandler = () =>{
    closeModal();
  }
  
  const checkEmailInput = () => {
    if (!EmailTxt.trim()) {
        setEmailValidMessage(msgStr('emptyField'));
    } else if (!isValidEmailFormat(EmailTxt)) {
        setEmailValidMessage(msgStr('invalidEmailFormat'));
    } else {
        setEmailValidMessage('');
    }
  };

  const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkInput = () => {
    if (!DocumentNameTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return (
    isModalVisible?(
    <View style={{position:'absolute', width:"100%", height:"100%"}}>
      <BasicModalContainer>
        <ModalHeader label={"Document"} closeModal={()=>{ closeModalhandler();}} />
        <ModalBody>
          <Text style={styles.label}>Document Name</Text>
          <TextInput style={styles.input} placeholder="Document Name" value={DocumentNameTxt} onChangeText={setDocumentNameTxt} placeholderTextColor="#ccc" onBlur={checkInput}/>
          {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>}

          <View style={{flexDirection:'row', alignItems:'center'}}>
            <RadioButton value={0} status={documentType == 0 ? "checked" : "unchecked"} style={{marginRight:10}} onPress={() => setDocumentType(0)}/> 
            <Text>{"Internal document"}</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', marginBottom: 10}}>
            <RadioButton value={1} status={documentType == 1 ? "checked" : "unchecked"} style={{marginRight:10}} onPress={() => setDocumentType(1)}/> 
            <Text>{"Upload file"}</Text>
          </View>
          {documentType == 0 && (
            <>
            {Platform.OS == 'web' && (
              <Editor value={documentContentTxt} onTextChange={(e) => setDocumentContentTxt(e.htmlValue)} style={{height: 208, width:650}} />
            )}
            </>
          )}
          {documentType == 1 && (
            <>
            {Platform.OS == 'web' && (
              <View style={styles.imagePicker}>
                <TouchableOpacity style={styles.imageUpload} onPress={() => inputRef.current.click()}>
                  {imagePreviewUrl ? (
                    <View style={styles.pdfContainer}>
                      <Document file={imagePreviewUrl} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={"1"} />
                      </Document>
                      {/* <Text>Page {pageNumber} of {numPages}</Text> */}
                    </View>
                  ) : (
                    <View style={styles.imageBox}>
                      <Text style={styles.boxText}>Click to choose an image</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <input
                  type="file" 
                  ref={inputRef} 
                  style={styles.fileInput} 
                  onChange={handleImageSelection} 
                  />
              </View>
            )}
            </>
          )}
          
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity onPress={AddButtonHandler}>
            <Text style={styles.addButton}>{isUpdate?"Update":"Add"}</Text>
          </TouchableOpacity>
        </ModalFooter>
      </BasicModalContainer>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View >)
    :null
  );
};

const styles = documentModalstyles;

export default AddDocumentModal;
