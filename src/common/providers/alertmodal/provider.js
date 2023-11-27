import React, { useContext, useState } from 'react';
import { AlertModalContext } from './Context'

export const AlertModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalText, setModalText] = useState('');
  const [modalBtnText, setModalBtnText] = useState('');

  const showAlert = (mode, text, btntxt) => {
    setModalType(mode);
    setModalText(text);
    setModalBtnText(btntxt);
    setModalVisible(true);
  }

  const closeAlert = () => {
    setModalVisible(false);
  }

  const alertValues = {
    modalVisible,
    modalType,
    modalText,
    modalBtnText,
    showAlert,
    closeAlert,
    setModalVisible
  }

  return (
    <AlertModalContext.Provider value={alertValues}>
      {children}
    </AlertModalContext.Provider>
  );
};
