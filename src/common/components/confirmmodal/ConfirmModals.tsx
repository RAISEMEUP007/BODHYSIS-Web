import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useConfirmModal } from '../../hooks/UseConfirmModal';

const ConfirmModal = () => {
  const { modalVisible, modalText, cancelText, closeConfirm, cancel, confirm } = useConfirmModal();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <Pressable style={styles.centeredView} onPress={closeConfirm} >
        <Pressable style={[styles.modalView, styles.bootstrapModalView]} onPress={(event)=>{event.preventDefault();}} >
          <Text style={styles.modalText}>{modalText}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={cancel}
            >
              <Text style={[styles.textStyle, styles.cancelButtonText]}>{cancelText || "Cancel"}</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirmButton]}
              onPress={confirm}
            >
              <Text style={[styles.textStyle, styles.confirmButtonText]}>{"OK"}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    cursor: 'default',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    cursor: 'default',
    margin: 20,
    borderWidth: 1,
    borderColor: '#ccc',
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
  bootstrapModalView: {
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  confirmButton: {
    backgroundColor: 'green',
  },
  cancelButtonText: {
    color: '#fff',
  },
  confirmButtonText: {
    color: '#fff',
  },
});

export { ConfirmModal };
