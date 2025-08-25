import React, { useState, useEffect } from 'react';
import '../styles/LinkSettingsModal.css';

const LinkSettingsModal = ({ isOpen, link, onClose, onSave, onDelete, onCopyLink, onMove, isOwner = true }) => {
    const [linkName, setLinkName] = useState('');

    // link가 변경될 때마다 linkName 초기화
    useEffect(() => {
        if (link) {
            setLinkName(link.linkName || '');
        }
    }, [link]);

    if (!isOpen || !link) return null;

    const handleSave = () => {
        onSave(link, linkName);
    };

    const handleCopyLink = () => {
        onCopyLink(link); // Hook의 함수 호출
    };

    const handleDelete = () => {
        onDelete(link);
    };

    const clearInput = () => {
        setLinkName('');
    };

    const titleLen = linkName ? linkName.length : 0;
    const MAX_TITLE = 30;

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
                                disabled={!isOwner}
                                maxLength={MAX_TITLE}
                            />
                            {linkName && (
                                <button className="ClearInputBtn" onClick={clearInput}>
                                    ✕
                                </button>
                            )}
                            <span className="LinkNameCounter">
                                {titleLen} / {MAX_TITLE}
                            </span>
                        </div>

                        {/* 메뉴 옵션들 */}
                        <div className="LinkSettingsMenu">
                            <button className="LinkSettingsMenuItem" onClick={handleCopyLink}>
                                <img src="/copy_icon.png" alt="복사" className="LinkSettingsIcon" />
                                <span>링크 복사하기</span>
                            </button>

                            {isOwner && (
                                <>
                                    <button
                                        className="LinkSettingsMenuItem LinkMoveItem"
                                        onClick={() => onMove && onMove(link)}
                                    >
                                        <img src="/folder_move_icon.png" alt="이동" className="LinkSettingsIcon" />
                                        <span>링크 이동하기</span>
                                    </button>
                                    <button className="LinkSettingsMenuItem DeleteItem" onClick={handleDelete}>
                                        <img src="/delete.png" alt="삭제" className="LinkSettingsIcon" />
                                        <span>삭제하기</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="LinkSettingsModalFooter">
                        <button className="LinkSettingsBtn CancelBtn" onClick={onClose}>
                            취소
                        </button>
                        {isOwner && (
                            <button className="LinkSettingsBtn ConfirmBtn" onClick={handleSave}>
                                확인
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LinkSettingsModal;
