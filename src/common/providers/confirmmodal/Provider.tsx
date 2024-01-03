import React, { useState } from 'react';
import { ConfirmModalContext } from './Context'

export const ConfirmModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('Are you sure?');
  const [confirmAction, setConfirmAction] = useState(null);

  const showConfirm = (text, action) => {
    setModalText(text);
    setConfirmAction(() => action);
    setModalVisible(true);
  }

  const closeConfirm = () => {
    setModalVisible(false);
  }
  
  const confirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    closeConfirm();
  }

  const confirmValues = {
    modalVisible,
    modalText,
    showConfirm,
    closeConfirm,
    confirm,
    setModalVisible
  }

  return (
    <ConfirmModalContext.Provider value={confirmValues}>
      {children}
    </ConfirmModalContext.Provider>
  );
};
