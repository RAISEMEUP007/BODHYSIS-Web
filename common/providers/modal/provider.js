import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext({
  modalVisible: false,
  text: "",
  setModalVisible: () => {},
  setText: () => {},
});

export const useModal = () => {
  return useContext(ModalContext);
};

export const ModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");

  return (
    <ModalContext.Provider value={{ modalVisible, text, setModalVisible, setText }}>
      {children}
    </ModalContext.Provider>
  );
};
