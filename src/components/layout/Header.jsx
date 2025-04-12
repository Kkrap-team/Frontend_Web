import React, { useState, useContext } from 'react';
import './Header.css';
import KakaoLoginBtn from '../../features/auth/components/KakaoLoginBtn';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchInput from '../../features/search/components/SearchInput';

export default function Header() {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [showSearchInput, setShowSearchInput] = useState(false);

    const handleLogout = () => {
        setUser(null);
        alert('로그아웃 되었습니다.');
    };

    const toggleSearch = () => {
        setShowSearchInput((prev) => !prev);
    };

    return (
        <>
            <header className="header">
                {/* 로고 */}
                <div className="logo">
                    <img src="/Kkrap_logo.png" alt="크크랩 로고" className="logo-image" />
                    <span className="logo-text1">크</span>
                    <span className="logo-text2">크</span>
                    <span className="logo-text1">랩</span>
                </div>

                {/* 네비게이션 */}
                <nav className="nav">
                    <button
                        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={() => navigate('/')}
                    >
                        <img src="main_screen.png" alt="메인화면" className="nav-icon" />
                        <span>메인화면</span>
                    </button>

                    <button
                        className={`nav-item ${location.pathname.startsWith('/storage') ? 'active' : ''}`}
                        onClick={() => navigate('/storage')}
                    >
                        <img src="storage_box.png" alt="보관함" className="nav-icon" />
                        <span>보관함</span>
                    </button>

                    <button
                        className={`nav-item ${location.pathname.startsWith('/follower') ? 'active' : ''}`}
                        onClick={() => navigate('/follower')}
                    >
                        <img src="follower.png" alt="팔로워" className="nav-icon" />
                        <span>팔로워</span>
                    </button>

                    <button className={`nav-item ${showSearchInput ? 'active' : ''}`} onClick={toggleSearch}>
                        {console.log('검색창', showSearchInput)}
                        <img src="search.png" alt="검색" className="nav-icon" />
                        <span>검색</span>
                    </button>
                </nav>

                {/* 로그인/프로필 영역 */}
                <div className="right-menu">
                    {user ? (
                        <>
                            <img
                                src={user.profile}
                                alt="프로필"
                                className="profile-image"
                                onClick={() => navigate('/profile')}
                            />
                            <span className="nickname">{user.nickname}님, 환영합니다.</span>
                            <button onClick={handleLogout} className="logout-button">
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <KakaoLoginBtn className="login-button" />
                    )}
                    <button className="more-button">⋮</button>
                </div>
            </header>
            {showSearchInput && <SearchInput />}
        </>
    );
}
