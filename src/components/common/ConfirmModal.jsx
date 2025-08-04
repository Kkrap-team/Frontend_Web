import React from 'react';
import '@/components/common/ConfirmModal.css';

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmText = '확인',
    cancelText,
    confirmType = 'save', // 'save' | 'delete'
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm?.();
    };

    const handleCancel = () => {
        onCancel?.();
    };

    return (
        <div className="ConfirmModalOverlay" onClick={handleCancel}>
            <div className="ConfirmModal" onClick={(e) => e.stopPropagation()}>
                <div className="ConfirmModalHeader">
                    <h3>{title}</h3>
                </div>
                <div className="ConfirmModalContent">
                    <p>{message}</p>
                </div>
                <div className="ConfirmModalFooter">
                    {cancelText && (
                        <button className="ConfirmModalCancelBtn" onClick={handleCancel}>
                            {cancelText}
                        </button>
                    )}
                    <button
                        className={`ConfirmModalConfirmBtn ConfirmModalConfirmBtn--${confirmType} ${
                            !cancelText ? 'ConfirmModalConfirmBtn--full' : ''
                        }`}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
