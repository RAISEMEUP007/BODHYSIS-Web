import React, { useState } from 'react';
import { AlertModalContext } from './Context';

export const AlertModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalText, setModalText] = useState<string>('');
  const [modalBtnText, setModalBtnText] = useState<string>('');

  const showAlert = (mode: string, text: string, btntxt: string) => {
    setModalType(mode);
    setModalText(text);
    setModalBtnText(btntxt);
    setModalVisible(true);
  };

  const closeAlert = () => {
    setModalVisible(false);
  };

  const alertValues = {
    modalVisible,
    modalType,
    modalText,
    modalBtnText,
    showAlert,
    closeAlert,
    setModalVisible,
  };

  return <AlertModalContext.Provider value={alertValues}>{children}</AlertModalContext.Provider>;
};
