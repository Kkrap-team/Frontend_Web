// src/contexts/ModalContext.jsx
import { createContext, useContext, useState } from 'react';
import ConfirmModal from '@/components/common/ConfirmModal';

const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }) => {
    const [confirmModal, setConfirmModal] = useState(null);
    const [modalName, setModalName] = useState(null);
    const [modalProps, setModalProps] = useState({});

    const showConfirm = (config) => {
        setConfirmModal(config);
    };

    const hideConfirm = () => {
        setConfirmModal(null);
    };

    const showModal = (name, props = {}) => {
        setModalName(name);
        setModalProps(props);
    };

    const hideModal = () => {
        setModalName(null);
        setModalProps({});
    };

    return (
        <ModalContext.Provider
            value={{
                showConfirm,
                hideConfirm,
                showModal,
                hideModal,
                modalName,
                modalProps,
            }}
        >
            {children}
            {confirmModal && (
                <ConfirmModal
                    {...confirmModal}
                    isOpen={true}
                    onConfirm={() => {
                        confirmModal.onConfirm?.();
                        hideConfirm();
                    }}
                    onCancel={() => {
                        confirmModal.onCancel?.();
                        hideConfirm();
                    }}
                />
            )}
        </ModalContext.Provider>
    );
};
