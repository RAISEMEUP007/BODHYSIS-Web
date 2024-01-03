import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getDocumentsData, deleteDocument, } from '../../../api/Settings';
import { msgStr } from '../../../common/constants/Message';
import { TextMediumSize } from '../../../common/constants/Fonts';
import { useAlertModal } from '../../../common/hooks/UseAlertModal';
import { useConfirmModal } from '../../../common/hooks/UseConfirmModal';
import BasicLayout from '../../../common/components/CustomLayout/BasicLayout';

import { documentsStyle } from './styles/DocumentsStyle';
import AddDocumentModal from './AddDocumentModal';

const Documents = ({navigation, openInventory}) => {
  const screenHeight = Dimensions.get('window').height;
  
  const { showAlert } = useAlertModal();
  const { showConfirm } = useConfirmModal();

  const [tableData, setTableData] = useState([]);
  const [updateDocumentTrigger, setUpdateDocumentTrigger] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const openAddDocumentModal = () => { setAddModalVisible(true); setSelectedDocument(null)}
  const closeAddDocumentModal = () => { setAddModalVisible(false); setSelectedDocument(null)}
  const editDocument = (index) => { setSelectedDocument(tableData[index]); setAddModalVisible(true); }

  useEffect(()=>{
    if(updateDocumentTrigger == true) getTable();
  }, [updateDocumentTrigger]);

  const removeDocument = (id) => {
    showConfirm(msgStr('deleteConfirmStr'), ()=>{
      deleteDocument(id, (jsonRes, status, error)=>{
        switch(status){
          case 200:
            setUpdateDocumentTrigger(true);
            showAlert('success', jsonRes.message);
            break;
          default:
            if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            else showAlert('error', msgStr('unknownError'));
            break;
        }
      })
    });
  }

  const getTable = () => {
    getDocumentsData((jsonRes, status, error) => {
      switch(status){
        case 200:
          setUpdateDocumentTrigger(false);
          setTableData(jsonRes);
          break;
        case 500:
          showAlert('error', msgStr('serverError'));
          break;
        default:
          if(jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
          else showAlert('error', msgStr('unknownError'));
          break;
      }
    })
  }
  
  const renderTableData = () => {
    const rows = [];
    if(tableData.length > 0){
      tableData.map((item, index) => {
        rows.push( 
          <View key={index} style={styles.tableRow}>
            <View style={[styles.cell, {width: 300}]}>
              <Text>{item.document_name}</Text>
            </View>
            <View style={[styles.IconCell]}>
              {(item.document_type == 0) ? (
                <Text>{"INT"}</Text>
              ):(
                <FontAwesome5 size={TextMediumSize} name="file-pdf" color="black" />
              )}
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{editDocument(index)}}>
                <FontAwesome5 size={TextMediumSize} name="edit" color="black" />
              </TouchableOpacity>
            </View>
            <View style={[styles.IconCell]}>
              <TouchableOpacity onPress={()=>{removeDocument(item.id)}}>
                <FontAwesome5 size={TextMediumSize} name="times" color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      });
    }else{
      <></>
    }
    return <>{rows}</>;
  };
  
  return (
    <BasicLayout
      navigation = {navigation}
      screenName={'Documents'}
    >
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.button} onPress={openAddDocumentModal}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, {width: 300}]}>{"Document Name"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"Type"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"Edit"}</Text>
              <Text style={[styles.columnHeader, styles.IconCell]}>{"DEL"}</Text>
            </View>
            <ScrollView style={{ flex: 1, maxHeight: screenHeight-220 }}>
              {renderTableData()}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      
      <AddDocumentModal
        isModalVisible={isAddModalVisible}
        Document={selectedDocument}
        setUpdateDocumentTrigger = {setUpdateDocumentTrigger} 
        closeModal={closeAddDocumentModal}
      />
    </BasicLayout>
  );
};

const styles = documentsStyle;

export default Documents;