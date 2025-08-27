// src/features/header/components/NavMenu.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import CreateModal from '@/features/create/components/CreateModal';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 768);
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return isMobile;
}

export default function NavMenu({ toggleSearch, showSearchInput }) {
    const navigate = useNavigate();
    const pathname = useRouterState({ select: (state) => state.location.pathname });
    const { user } = useAuthStore();
    const userId = user?.userId;
    const profileUrlBase = import.meta.env.VITE_URL;
    const profileSrc = user?.profile
        ? `${user.profile.startsWith('http') ? user.profile : `${profileUrlBase}${user.profile}`}`
        : '/account_circle.png';
    const isMobile = useIsMobile();

    return (
        <nav className="NavMenu">
            {/* 홈 */}
            <button className={`NavItem ${pathname === '/' ? 'Active' : ''}`} onClick={() => navigate({ to: '/' })}>
                <img src="/main_screen.png" alt="홈" className="NavIcon" />
                <span>홈</span>
            </button>

            {/* 검색 */}
            <button className={`NavItem ${showSearchInput ? 'Active' : ''}`} onClick={toggleSearch}>
                <img src="/search.png" alt="검색" className="NavIcon" />
                <span>검색</span>
            </button>

            {/* 모바일에서만 중앙 Create 버튼 */}
            {isMobile && (
                <div className="NavItem Create">
                    <CreateModal
                        showFolderCreate
                        onSuccess={(created) => {
                            try {
                                if (created && typeof created === 'object') {
                                    if ('foldersId' in created) {
                                        window.dispatchEvent(
                                            new CustomEvent('links:refresh', {
                                                detail: { folderId: created.foldersId, createdLink: created },
                                            })
                                        );
                                    } else if ('folderId' in created) {
                                        window.dispatchEvent(
                                            new CustomEvent('folders:refresh', { detail: { createdFolder: created } })
                                        );
                                    }
                                }
                            } catch (_) {}
                        }}
                    />
                </div>
            )}

            {/* 팔로우 */}
            <button
                className={`NavItem ${pathname.startsWith('/follower') ? 'Active' : ''}`}
                onClick={() => navigate({ to: '/follower' })}
            >
                <img src="/follower.png" alt="팔로우" className="NavIcon" />
                <span>팔로우</span>
            </button>

            {/* 내 페이지 (프로필 아이콘) */}
            <button
                className={`NavItem ${pathname.startsWith('/storage') ? 'Active' : ''}`}
                onClick={() => navigate({ to: `/storage/${userId}` })}
            >
                <img src={profileSrc} alt="내 페이지" className="NavIcon NavProfile" />
                <span>내 페이지</span>
            </button>
        </nav>
    );
}
