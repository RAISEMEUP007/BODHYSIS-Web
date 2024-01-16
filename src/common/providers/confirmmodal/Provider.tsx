import React, { useState } from 'react';
import { ConfirmModalContext } from './Context';

export const ConfirmModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('Are you sure?');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const showConfirm = (text: string, action: () => void) => {
    setModalText(text);
    setConfirmAction(() => action);
    setModalVisible(true);
  };

  const closeConfirm = () => {
    setModalVisible(false);
  };

  const confirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    closeConfirm();
  };

  const confirmValues = {
    modalVisible,
    modalText,
    showConfirm,
    closeConfirm,
    confirm,
    setModalVisible,
  };

  return (
    <ConfirmModalContext.Provider value={confirmValues}>{children}</ConfirmModalContext.Provider>
  );
};
