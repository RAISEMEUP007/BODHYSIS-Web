import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useAlertModal } from '../../hooks/useAlertModal';

const AlertModals = () => {
    const { modalType, modalVisible, closeAlert } = useAlertModal();
  
    let modalBackgroundColor = '';
    let modalText = 'Default Modal Text';
    let modalBtnText = 'OK';
    let modalBtnColor = '';

    switch (modalType) {
        case 'success':
            ({ modalText = 'Success', modalBtnText = 'Okay' } = useAlertModal());
            modalBackgroundColor = '#d4edda'; 
            modalBtnColor = '#28a745';
            break;
        case 'error':
            ({ modalText = 'Error', modalBtnText = 'Got it' } = useAlertModal());
            modalBackgroundColor = '#f8d7da';
            modalBtnColor = '#dc3545';
            break;
        case 'warning':
            ({ modalText = 'Warning', modalBtnText = 'Got it' } = useAlertModal());
            modalBackgroundColor = '#fff3cd';
            modalBtnColor = '#ffc107';
            break;
        default:
            ({ modalText = 'Default', modalBtnText = 'OK' } = useAlertModal());
            modalBackgroundColor = '#f8f9fa';
            modalBtnColor = '#007bff';
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
        >
            <View style={styles.centeredView}>
            <View style={[styles.modalView, { backgroundColor: modalBackgroundColor }]}>
                <Text style={styles.modalText}>{modalText}</Text>
                <Pressable
                    style={[styles.button, styles.buttonClose, { backgroundColor: modalBtnColor }]}
                    onPress={closeAlert}
                >
                    <Text style={[styles.textStyle, { color: '#fff' }]}>{modalBtnText}</Text>
                </Pressable>
            </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
});

export {AlertModals};
