import React, { useContext, useState } from 'react';
import { BasicModalContext } from './Context'

export const BasicModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');

  const showModal = (text) => {
    setModalText(text);
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  const alertValues = {
    modalVisible,
    modalText,
    showModal,
    closeModal,
    setModalText,
    setModalVisible
  }

  return (
    <BasicModalContext.Provider value={alertValues}>
      {children}
    </BasicModalContext.Provider>
  );
};
