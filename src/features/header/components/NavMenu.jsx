// src/features/header/components/NavMenu.jsx
import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';

export default function NavMenu({ toggleSearch, showSearchInput }) {
    const navigate = useNavigate();
    const pathname = useRouterState({ select: (state) => state.location.pathname });
    const { user } = useAuthStore();
    const userId = user?.userId;

    return (
        <nav className="NavMenu">
            <button className={`NavItem ${pathname === '/' ? 'Active' : ''}`} onClick={() => navigate({ to: '/' })}>
                <img src="/main_screen.png" alt="메인화면" className="NavIcon" />
                <span>메인화면</span>
            </button>

            <button
                className={`NavItem ${pathname.startsWith('/storage') ? 'Active' : ''}`}
                onClick={() => navigate({ to: `/storage/${userId}` })}
            >
                <img src="/storage_box.png" alt="보관함" className="NavIcon" />
                <span>보관함</span>
            </button>

            <button
                className={`NavItem ${pathname.startsWith('/follower') ? 'Active' : ''}`}
                onClick={() => navigate({ to: '/follower' })}
            >
                <img src="/follower.png" alt="팔로워" className="NavIcon" />
                <span>팔로우</span>
            </button>

            <button className={`NavItem ${showSearchInput ? 'Active' : ''}`} onClick={toggleSearch}>
                <img src="/search.png" alt="검색" className="NavIcon" />
                <span>검색</span>
            </button>
        </nav>
    );
}
