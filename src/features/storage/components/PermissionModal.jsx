import React, { useState, useMemo } from 'react';
import '@/features/storage/styles/PermissionModal.css';

const PermissionModal = ({
    isOpen,
    users, // allCandidates
    invitedUsers,
    notInvitedUsers,
    owner,
    selectedUsers,
    onUserSelect,
    onClose,
    onConfirm,
    onRevoke,
    loading = false,
    error = null,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('invite'); // 'invite' | 'permissions'

    // allCandidates에서 전체 검색 후 탭별로 필터링
    const filteredUsers = useMemo(() => {
        // allCandidates (전체 후보들)에서 검색
        if (!Array.isArray(users)) return [];

        // 검색어로 필터링 (전체에서 검색)
        let searchResults = users;
        if (searchTerm.trim()) {
            searchResults = users.filter(
                (user) =>
                    user.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            // 검색어가 있으면 탭별 필터링 하지 않고 검색 결과를 그대로 표시
            return searchResults;
        }

        // 검색어가 없을 때만 탭별로 필터링
        if (activeTab === 'invite') {
            return searchResults.filter((user) => !user.invited); // 미초대 사용자만
        } else {
            return searchResults.filter((user) => user.invited); // 초대된 사용자만
        }
    }, [users, activeTab, searchTerm]);

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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm(''); // 탭 변경 시 검색어 초기화
    };

    return (
        <div className="ModalOverlay" onClick={onClose}>
            <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
                {/* 상단 타이틀 */}
                <div className="ModalTitle">권한 부여하기</div>

                {/* 오너 정보 */}
                {owner && (
                    <div className="OwnerInfo">
                        <div className="OwnerLabel">폴더 소유자</div>
                        <div className="OwnerItem">
                            <img
                                className="OwnerAvatar"
                                src={owner.profile || '/Kkrap_logo.png'}
                                alt={owner.nickname}
                                onError={(e) => {
                                    e.target.src = '/Kkrap_logo.png';
                                }}
                            />
                            <div className="OwnerDetails">
                                <div className="OwnerName">{owner.nickname}</div>
                                <div className="OwnerEmail">{owner.email}</div>
                            </div>
                        </div>
                    </div>
                )}

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

                {/* 탭 네비게이션 */}
                <div className="TabNavigation">
                    <button
                        className={`TabButton ${activeTab === 'invite' ? 'active' : ''}`}
                        onClick={() => handleTabChange('invite')}
                    >
                        초대하기
                    </button>
                    <button
                        className={`TabButton ${activeTab === 'permissions' ? 'active' : ''}`}
                        onClick={() => handleTabChange('permissions')}
                    >
                        권한 목록 조회
                    </button>
                </div>

                {/* 유저 리스트 */}
                <div className="UserList">
                    {loading && <div className="LoadingMessage">사용자 목록을 불러오는 중...</div>}

                    {error && <div className="ErrorMessage">사용자 목록을 불러오는데 실패했습니다.</div>}

                    {!loading && !error && filteredUsers.length === 0 && (
                        <div className="EmptyMessage">
                            {searchTerm
                                ? '검색 결과가 없습니다.'
                                : activeTab === 'invite'
                                  ? '초대 가능한 사용자가 없습니다.'
                                  : '초대된 사용자가 없습니다.'}
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
                                {!user.invited ? (
                                    // 미초대 사용자: 체크박스 표시
                                    <input
                                        type="checkbox"
                                        className="UserCheckbox"
                                        checked={isUserSelected(user)}
                                        onChange={() => handleUserToggle(user)}
                                    />
                                ) : (
                                    // 초대된 사용자: 삭제 버튼 표시
                                    <button className="RevokeButton" onClick={() => onRevoke(user.followingId)}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                </div>

                {/* 하단 버튼 */}
                <div className="ModalActions">
                    <button className="CancelBtn" onClick={onClose}>
                        취소
                    </button>
                    {activeTab === 'invite' && (
                        <button className="ConfirmBtn" onClick={onConfirm} disabled={selectedUsers.length === 0}>
                            확인
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermissionModal;
