import React, { useState } from 'react';
import { ConfirmModalContext } from './Context';

export const ConfirmModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('Are you sure?');
  const [cancelText, setCancelText] = useState<string>('Cancel');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [cancelAction, setCancelAction] = useState<() => void>(() => {});

  const showConfirm = (text: string, action: () => void, cancelFunc: () => void, cancelText = "Cancel") => {
    setModalText(text);
    setConfirmAction(() => action);
    if(cancelFunc) setCancelAction(()=>cancelFunc);
    if(cancelText) setCancelText(cancelText);
    setModalVisible(true);
  };

  const closeConfirm = () => {
    setModalVisible(false);
  };

  const cancel = () => {
    setModalVisible(false);
    if(cancelAction) cancelAction();
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
    cancelText,
    showConfirm,
    closeConfirm,
    cancel,
    confirm,
    setModalVisible,
  };

  return (
    <ConfirmModalContext.Provider value={confirmValues}>{children}</ConfirmModalContext.Provider>
  );
};
