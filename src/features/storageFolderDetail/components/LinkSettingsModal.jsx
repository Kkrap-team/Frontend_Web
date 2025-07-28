import React, { useState } from 'react';
import '../styles/LinkSettingsModal.css';

const LinkSettingsModal = ({ isOpen, link, onClose, onSave, onDelete }) => {
    const [linkName, setLinkName] = useState(link?.linkName || '');
    const [confirmType, setConfirmType] = useState(null); // 'save' 또는 'delete'
    console.log('링크설정모달 링크', link);

    if (!isOpen || !link) return null;

    const handleSave = () => {
        // 링크 이름이 변경되었는지 확인
        const hasChanged = linkName !== link.linkName;

        if (hasChanged) {
            // 변경사항이 있으면 수정 확인 모달 표시
            setConfirmType('save');
        } else {
            onClose();
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(link.linkUrl);
        alert('링크가 복사되었습니다.');
    };

    const handleDelete = () => {
        setConfirmType('delete');
    };

    // 확인 처리 (수정 또는 삭제)
    const handleConfirm = () => {
        if (confirmType === 'save') {
            onSave({ ...link, linkName });
            onClose();
        } else if (confirmType === 'delete') {
            onDelete(link);
            // onClose()는 handleDelete 함수 내부에서 처리됨
        }
        setConfirmType(null);
    };

    // 취소 처리
    const handleCancel = () => {
        setConfirmType(null);
    };

    const clearInput = () => {
        setLinkName('');
    };

    return (
        <>
            {/* 메인 설정 모달 */}
            <div className="LinkSettingsModalOverlay" onClick={onClose}>
                <div className="LinkSettingsModal" onClick={(e) => e.stopPropagation()}>
                    <div className="LinkSettingsModalHeader">
                        <h2>설정</h2>
                    </div>

                    <div className="LinkSettingsModalContent">
                        {/* 링크명 수정 입력 */}
                        <div className="LinkNameInputWrapper">
                            <input
                                type="text"
                                value={linkName}
                                onChange={(e) => setLinkName(e.target.value)}
                                placeholder={link.linkName}
                                className="LinkNameInput"
                            />
                            {linkName && (
                                <button className="ClearInputBtn" onClick={clearInput}>
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* 메뉴 옵션들 */}
                        <div className="LinkSettingsMenu">
                            <button className="LinkSettingsMenuItem" onClick={handleCopyLink}>
                                <img src="/copy_icon.png" alt="복사" className="LinkSettingsIcon" />
                                <span>링크 복사하기</span>
                            </button>

                            <button className="LinkSettingsMenuItem DeleteItem" onClick={handleDelete}>
                                <img src="/delete.png" alt="삭제" className="LinkSettingsIcon" />
                                <span>삭제하기</span>
                            </button>
                        </div>
                    </div>

                    <div className="LinkSettingsModalFooter">
                        <button className="LinkSettingsBtn CancelBtn" onClick={onClose}>
                            취소
                        </button>
                        <button className="LinkSettingsBtn ConfirmBtn" onClick={handleSave}>
                            확인
                        </button>
                    </div>
                </div>
            </div>

            {/* 확인 모달 (수정/삭제 공통) */}
            {confirmType && (
                <div className="LinkSettingsModalOverlay" onClick={handleCancel}>
                    <div className="ConfirmModal" onClick={(e) => e.stopPropagation()}>
                        <div className="ConfirmModalHeader">
                            <h3>{confirmType === 'save' ? '확인' : '삭제 확인'}</h3>
                        </div>
                        <div className="ConfirmModalContent">
                            {confirmType === 'save' ? (
                                <p>링크 이름을 수정하시겠습니까?</p>
                            ) : (
                                <>
                                    <p>이 링크를 삭제하시겠습니까?</p>
                                </>
                            )}
                        </div>
                        <div className="ConfirmModalFooter">
                            <button className="LinkSettingsBtn CancelBtn" onClick={handleCancel}>
                                취소
                            </button>
                            <button
                                className={`LinkSettingsBtn ${confirmType === 'delete' ? 'DeleteBtn' : 'ConfirmBtn'}`}
                                onClick={handleConfirm}
                            >
                                {confirmType === 'save' ? '확인' : '삭제'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LinkSettingsModal;
