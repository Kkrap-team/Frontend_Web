// src/features/header/components/NavMenu.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavMenu({ toggleSearch, showSearchInput }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="nav">
            <button
                className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => navigate('/')}
            >
                <img src="/main_screen.png" alt="메인화면" className="nav-icon" />
                <span>메인화면</span>
            </button>

            <button
                className={`nav-item ${location.pathname.startsWith('/Library') ? 'active' : ''}`}
                onClick={() => navigate('/Library')}
            >
                <img src="/storage_box.png" alt="보관함" className="nav-icon" />
                <span>보관함</span>
            </button>

            <button
                className={`nav-item ${location.pathname.startsWith('/follower') ? 'active' : ''}`}
                onClick={() => navigate('/follower')}
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
