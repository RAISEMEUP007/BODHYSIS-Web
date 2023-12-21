import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Platform, Image, Picker } from 'react-native';

import { createReservationType, updateReservationType } from '../../../api/Settings';
import BasicModalContainer from '../../../common/components/basicmodal/BasicModalContainer';
import ModalHeader from '../../../common/components/basicmodal/ModalHeader';
import ModalBody from '../../../common/components/basicmodal/ModalBody';
import ModalFooter from '../../../common/components/basicmodal/ModalFooter';
import { msgStr } from '../../../common/constants/Message';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';

import { reservationTypeModalstyles } from './styles/ReservationTypeModalStyle';
import { API_URL } from '../../../common/constants/AppConstants';

const AddReservationTypeModal = ({ isModalVisible, ReservationType, setUpdateReservationTypeTrigger, closeModal }) => {
  const isUpdate = ReservationType ? true : false;
  const inputRef = useRef(null);

  const { showAlert } = useAlertModal();
  const [ValidMessage, setValidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [selectedStartStage, setSelectedStartStage] = useState(0);
  const [ReservationTypeNameTxt, setReservationTypeNameTxt] = useState('');
  const [selectedPageSize, setSelectedPageSize] = useState(0);

  const StartStageArr = [
    {id:1, stage:'stage1'},
    {id:2, stage:'stage2'},
  ];

  const PrintSizeArr = [
    {id:1, size:'Letter'},
    {id:2, size:'A4'},
  ];

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
      if(ReservationType){
        setReservationTypeNameTxt(ReservationType.name);
        setFilePreviewUrl(ReservationType.img_url?API_URL + ReservationType.img_url:'');

        const initalStge = StartStageArr.find(stage => {return stage.id == ReservationType.start_stage});
        if(initalStge) setSelectedStartStage(initalStge.id);
        else setSelectedStartStage(StartStageArr[0].id);

        const initalPrintSize = PrintSizeArr.find(stage => {return stage.id == ReservationType.print_size});
        if(initalPrintSize) setSelectedPageSize(initalPrintSize.id);
        else setSelectedPageSize(PrintSizeArr[0].id);

      }else{
        setReservationTypeNameTxt('');
        setFilePreviewUrl(null);
        setSelectedStartStage(PrintSizeArr[0].id);
        setSelectedPageSize(PrintSizeArr[0].id);
      }
      setSelectedFile(null);
    }else{
    }
  }, [isModalVisible])

  const handleFileSelection = (event) => {
    const file = Platform.OS === 'web' ? event.target.files[0] : event.nativeEvent.target.files[0];
  
    const filePreviewUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setFilePreviewUrl(filePreviewUrl); 
  };

  const AddButtonHandler = () => {
    if (!ReservationTypeNameTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
      return;
    } 
    
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', ReservationTypeNameTxt);
    formData.append('start_stage', selectedStartStage);
    formData.append('print_size', selectedPageSize);
    if(selectedFile) formData.append('img', selectedFile);

    const handleResponse = (jsonRes, status) => {
      switch(status){
        case 201:
          showAlert('success', jsonRes.message);
          setUpdateReservationTypeTrigger(true);
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
      formData.append('id', ReservationType.id);
      updateReservationType(formData, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    } else {
      createReservationType(formData, (jsonRes, status) => {
        handleResponse(jsonRes, status);
      });
    }
  };

  const closeModalhandler = () =>{
    closeModal();
  }

  const checkInput = () => {
    if (!ReservationTypeNameTxt.trim()) {
      setValidMessage(msgStr('emptyField'));
    } else {
      setValidMessage('');
    }
  };

  return (
    isModalVisible?(
    <View style={{position:'absolute', width:"100%", height:"100%"}}>
      <BasicModalContainer>
        <ModalHeader label={"ReservationType"} closeModal={()=>{ closeModalhandler();}} />
        <ModalBody>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} placeholder="Name" value={ReservationTypeNameTxt} onChangeText={setReservationTypeNameTxt} placeholderTextColor="#ccc" onBlur={checkInput}/>
          {(ValidMessage.trim() != '') && <Text style={styles.message}>{ValidMessage}</Text>}

          <Text style={styles.label}>Start stage</Text>
          <Picker
            style={styles.select}
            selectedValue={selectedStartStage}
            onValueChange={setSelectedStartStage}>
            {StartStageArr.length>0 && (
              StartStageArr.map((stageItem, index) => {
                return <Picker.Item key={index} label={stageItem.stage} value={stageItem.id} />
              })
            )}
          </Picker>

          {Platform.OS == 'web' && (
            <View style={styles.imagePicker}>
            <TouchableOpacity style={styles.imageUpload} onPress={() => inputRef.current.click()}>
              {filePreviewUrl ? (
                <Image source={{ uri: filePreviewUrl }} style={styles.previewImage} />
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
              onChange={handleFileSelection} 
            />
            </View>
          )}

          <Text style={styles.label}>Print Size</Text>
          <Picker
            style={styles.select}
            selectedValue={selectedPageSize}
            onValueChange={setSelectedPageSize}>
            {PrintSizeArr.length>0 && (
              PrintSizeArr.map((sizeItem, index) => {
                return <Picker.Item key={index} label={sizeItem.size} value={sizeItem.id} />
              })
            )}
          </Picker>
          
        </ModalBody>
        <ModalFooter>
          <View style={{flexDirection:'row'}}>
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

const styles = reservationTypeModalstyles;

export default AddReservationTypeModal;
