import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Platform, File } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Editor } from 'primereact/editor';

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
import { FontAwesome5 } from '@expo/vector-icons';
import { TextMediumLargeSize } from '../../../common/constants/Fonts';

const AddDocumentModal = ({ isModalVisible, Document, setUpdateDocumentTrigger, closeModal }) => {
  const isUpdate = Document ? true : false;
  const inputRef = useRef(null);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [DocumentNameTxt, setDocumentNameTxt] = useState('');
  const [documentType, setDocumentType] = useState(0);
  const [documentContentTxt, setDocumentContentTxt] = useState('');

  useEffect(() => {
    if(Platform.OS === 'web'){
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
        setFilePreviewUrl(Document.document_file?API_URL + Document.document_file:'');
      }else{
        setDocumentNameTxt('');
        setDocumentType(0);
        setDocumentContentTxt('');
        setFilePreviewUrl(null);
      }
      setSelectedFile(null);
    }else{
      setDocumentType(-1);
    }
  }, [isModalVisible])

  const handleFileSelection = (event) => {
    const file = Platform.OS === 'web' ? event.target.files[0] : event.nativeEvent.target.files[0];
    
    if (file.type !== "application/pdf") {
      showAlert('error', 'Please select a PDF file');
      return;
    }
  
    const filePreviewUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setFilePreviewUrl(filePreviewUrl); 
  };

  const printDocument = () => {
    const content = documentType == 0 ? documentContentTxt : (selectedFile ? filePreviewUrl : ''); // Use document content or file URL
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${DocumentNameTxt}</title>
          <style>
            @page {
              
            }
            body {
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <h1>${DocumentNameTxt}</h1>
          <p>${content}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
    if(selectedFile) formData.append('img', selectedFile);
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
            <TouchableOpacity style={{marginLeft:20}} onPress={() => inputRef.current.click()}>
              <FontAwesome5 size={TextMediumLargeSize} name="upload" color="black" />
            </TouchableOpacity>
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
              <View style={styles.filePicker}>
                {filePreviewUrl ? (
                  <embed style={{width:"100%"}} src={filePreviewUrl} type="application/pdf" width="300" height="500" />
                ) : (
                  <TouchableOpacity style={styles.fileUpload} onPress={() => inputRef.current.click()}>
                    <Text style={styles.boxText}>Click to choose an file</Text>
                  </TouchableOpacity>
                )}
                <input
                  type="file" 
                  ref={inputRef} 
                  style={styles.fileInput} 
                  onChange={handleFileSelection} 
                  />
              </View>
            )}
            </>
          )}
          
        </ModalBody>
        <ModalFooter>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{ marginRight: 20 }} onPress={printDocument}>
              <Text style={styles.addButton}>{"Print"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={AddButtonHandler}>
              <Text style={styles.addButton}>{isUpdate?"Update":"Add"}</Text>
            </TouchableOpacity>
          </View>
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
