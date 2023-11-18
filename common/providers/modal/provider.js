import React, { useState } from 'react';
import { ModalContext } from './context';

function isModalWithData(a) {
  return !!a.data;
}

export const ModalContextProvider = (props) => {
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(undefined);
  const [isClosing, setIsClosing] = useState(false);
  
  const modalApi = {
    showModal: (modalCall) => {
      setModal(modalCall.modal);

      if (isModalWithData(modalCall)) {
        setModalData(modalCall.data);
      }
    },
    hideModal: () => {
      if (isClosing) {
        setModal(null);
        setModalData(null);
        setIsClosing(false);
      } else {
        setIsClosing(true);
      }
    },
    modal,
    modalData,
    isClosing,
    returnClosedModal: () => setIsClosing(false),
  };

  return React.createElement(ModalContext.Provider, { value: modalApi }, props.children);
};
