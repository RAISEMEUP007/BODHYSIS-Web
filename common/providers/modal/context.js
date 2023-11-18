import { createContext } from 'react';

export const ModalContext = createContext({
  modal: null,
  modalData: null,
  showModal: () => undefined,
  hideModal: () => undefined,
  setMachineState: () => undefined,
  currentModalMachine: undefined,
  isClosing: false,
  returnClosedModal: () => undefined,
});
