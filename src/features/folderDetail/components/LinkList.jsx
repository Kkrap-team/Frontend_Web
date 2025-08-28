import React from 'react';
import LinkCard from './LinkCard';
import LinkSettingsModal from './LinkSettingsModal';
import MoveLinkModal from './MoveLinkModal';
import useLinkSettings from '../hooks/useLinkSettings';
import '../styles/LinkList.css';
import SharedUsersPanel from './SharedUsersPanel';

const LinkList = ({
    links,
    folderInfo,
    userId,
    refetch,
    invitedUsers = [],
    sharingLoading = false,
    onOpenPermission,
}) => {
    const searchParams = new URLSearchParams(window.location.search);
    const targetUserIdParam = searchParams.get('targetUserId');
    const isOwner = !targetUserIdParam || Number(targetUserIdParam) === Number(userId);

    const {
        showModal,
        selectedLink,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
        handleCopyLink,
        // move
        showMoveModal,
        openMove,
        closeMove,
        ownFolders,
        moving,
        handleMove,
    } = useLinkSettings(userId, refetch, isOwner);

    return (
        <div className="LinkListContainer">
            <div className="LinkListHeader">
                <h2 className="LinkListTitle">링크 목록 ({links.length}개)</h2>
                <div className="LinkListVisible">
                    <img
                        src={folderInfo?.visible ? '/visible_icon.png' : '/invisible_icon.png'}
                        alt={folderInfo?.visible ? '공개' : '비공개'}
                    />
                    {folderInfo?.visible ? '공개' : '비공개'}
                </div>
                {(folderInfo?.share || (invitedUsers && invitedUsers.length > 0)) && (
                    <SharedUsersPanel users={invitedUsers} loading={sharingLoading} onManage={onOpenPermission} />
                )}
            </div>
            {links.length === 0 ? (
                <div className="LinkListEmpty">
                    <p>아직 저장된 링크가 없습니다.</p>
                </div>
            ) : (
                <div className="LinkGrid">
                    {links.map((link) => (
                        <LinkCard key={link.linkId} link={link} onKebabClick={openModal} />
                    ))}
                </div>
            )}

            {/* 링크 설정 모달 */}
            <LinkSettingsModal
                isOpen={showModal}
                link={selectedLink}
                onClose={closeModal}
                onSave={handleSave}
                onDelete={handleDelete}
                onCopyLink={handleCopyLink}
                onMove={openMove}
                isOwner={isOwner}
            />

            {/* 링크 이동 모달 */}
            <MoveLinkModal
                isOpen={showMoveModal}
                onClose={closeMove}
                folders={ownFolders}
                sourceFolderId={folderInfo?.folderId}
                onSubmit={handleMove}
                submitting={moving}
            />
        </div>
    );
};

export default LinkList;
