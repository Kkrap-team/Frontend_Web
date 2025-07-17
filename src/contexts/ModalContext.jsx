// src/contexts/ModalContext.jsx
import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalName, setModalName] = useState(null);
  const [modalProps, setModalProps] = useState({});

  const showModal = (name, props = {}) => {
    setModalName(name);
    setModalProps(props);
  };

  const hideModal = () => {
    setModalName(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modalName, modalProps }}>
      {children}
    </ModalContext.Provider>
  );
};