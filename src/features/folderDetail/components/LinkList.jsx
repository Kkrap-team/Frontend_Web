import React from 'react';
import LinkCard from './LinkCard';
import LinkSettingsModal from './LinkSettingsModal';
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
    const { showModal, selectedLink, openModal, closeModal, handleSave, handleDelete, handleCopyLink } =
        useLinkSettings(userId, refetch);

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
                {folderInfo?.share && (
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
            />
        </div>
    );
};

export default LinkList;
