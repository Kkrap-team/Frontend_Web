// src/features/header/components/NavMenu.jsx
import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useModal } from '@/contexts/ModalContext';

export default function NavMenu({ toggleSearch, showSearchInput }) {
    const navigate = useNavigate();
    const pathname = useRouterState({ select: (state) => state.location.pathname });
    
    const {showModal, modalName} = useModal();
    const isFollowerOpen = modalName === 'follower';

    return (
        <nav className="nav">
            <button className={`nav-item ${pathname === '/' ? 'active' : ''}`} onClick={() => navigate({ to: '/' })}>
                <img src="/main_screen.png" alt="메인화면" className="nav-icon" />
                <span>메인화면</span>
            </button>

            <button
                className={`nav-item ${pathname.startsWith('/storage') ? 'active' : ''}`}
                onClick={() => navigate({ to: '/storage' })}
            >
                <img src="/storage_box.png" alt="보관함" className="nav-icon" />
                <span>보관함</span>
            </button>

            <button
                className={`nav-item${modalName === 'follower' ? 'active':''}`}
                onClick={()=>showModal('follower', {userId: 5})}
                disabled= {isFollowerOpen}
            >
                <img src="/follower.png" alt="팔로워" className="nav-icon" />
                <span>팔로워</span>
            </button>

            <button className={`nav-item ${showSearchInput ? 'active' : ''}`} onClick={toggleSearch}>
                <img src="/search.png" alt="검색" className="nav-icon" />
                <span>검색</span>
            </button>
        </nav>
    );
}
