import React, { useState } from 'react';
import { BasicModalContext } from './Context';

export const BasicModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');

  const showModal = (text: string) => {
    setModalText(text);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const alertValues = {
    modalVisible,
    modalText,
    showModal,
    closeModal,
    setModalText,
    setModalVisible,
  };

  return <BasicModalContext.Provider value={alertValues}>{children}</BasicModalContext.Provider>;
};
