import React, { useContext } from 'react';
import { useNavigate } from '@tanstack/react-router';
import KakaoLoginBtn from '../../auth/components/KakaoLoginBtn';
import useLogout from '../../auth/hooks/useLogout';
import { AuthContext } from '@/contexts/AuthContext';

const url = import.meta.env.VITE_URL;

console.log('URL', url);
export default function LoginMenu() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = useLogout();

    return (
        <div className="right-menu">
            {user ? (
                <>
                    <img
                        src={`${user.profile.startsWith('http') ? user.profile : `${url}${user.profile}`}?t=${Date.now()}`}
                        alt="프로필"
                        className="profile-image"
                        onClick={() => navigate({ to: '/editProfile' })}
                    />
                    <span className="nickname">{user.nickname}님, 환영합니다.</span>
                    <button onClick={logout} className="logout-button">
                        로그아웃
                    </button>
                </>
            ) : (
                <KakaoLoginBtn className="login-button" />
            )}
            <button className="more-button">⋮</button>
        </div>
    );
}
