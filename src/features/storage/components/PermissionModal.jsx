import React, { useState, useMemo } from 'react';
import '@/features/storage/styles/PermissionModal.css';

const PermissionModal = ({
    isOpen,
    users,
    selectedUsers,
    onUserSelect,
    onClose,
    onConfirm,
    onRevoke,
    loading = false,
    error = null,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // 검색어로 필터링된 유저 목록
    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;

        return users.filter(
            (user) =>
                user.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    if (!isOpen) return null;

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleUserToggle = (user) => {
        onUserSelect(user);
    };

    const isUserSelected = (user) => {
        return selectedUsers.some((selected) => selected.followingId === user.followingId);
    };

    return (
        <div className="ModalOverlay" onClick={onClose}>
            <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
                {/* 상단 타이틀 */}
                <div className="ModalTitle">권한 부여하기</div>

                {/* 검색창 */}
                <div className="SearchWrapper">
                    <input
                        type="text"
                        className="SearchInput"
                        placeholder="검색"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* 유저 리스트 */}
                <div className="UserList">
                    {loading && <div className="LoadingMessage">사용자 목록을 불러오는 중...</div>}

                    {error && <div className="ErrorMessage">사용자 목록을 불러오는데 실패했습니다.</div>}

                    {!loading && !error && filteredUsers.length === 0 && (
                        <div className="EmptyMessage">
                            {searchTerm ? '검색 결과가 없습니다.' : '팔로우하는 사용자가 없습니다.'}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        filteredUsers.map((user) => (
                            <div key={user.followingId} className="UserItem">
                                <img
                                    className="UserAvatar"
                                    src={user.profile || '/Kkrap_logo.png'}
                                    alt={user.nickname}
                                    onError={(e) => {
                                        e.target.src = '/Kkrap_logo.png';
                                    }}
                                />
                                <div className="UserInfo">
                                    <div className="UserName">
                                        {user.nickname}
                                        {user.invited && <span className="InvitedBadge">초대완료</span>}
                                    </div>
                                    <div className="UserEmail">{user.email}</div>
                                </div>
                                {user.invited ? (
                                    <button className="RevokeButton" onClick={() => onRevoke(user.followingId)}>
                                        권한 삭제
                                    </button>
                                ) : (
                                    <input
                                        type="checkbox"
                                        className="UserCheckbox"
                                        checked={isUserSelected(user)}
                                        onChange={() => handleUserToggle(user)}
                                    />
                                )}
                            </div>
                        ))}
                </div>

                {/* 하단 버튼 */}
                <div className="ModalActions">
                    <button className="CancelBtn" onClick={onClose}>
                        취소
                    </button>
                    <button className="ConfirmBtn" onClick={onConfirm} disabled={selectedUsers.length === 0}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PermissionModal;
