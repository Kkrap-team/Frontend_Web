import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import KakaoLoginBtn from '../../auth/components/KakaoLoginBtn';
import useLogout from '../../auth/hooks/useLogout';
import { AuthContext } from '@/contexts/AuthContext';

const URL = import.meta.env.VITE_URL;

console.log('URL', URL);
export default function LoginMenu() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = useLogout();

    return (
        <div className="right-menu">
            {user ? (
                <>
                    <img
                        src={`${URL}${user.profile}`}
                        alt="프로필"
                        className="profile-image"
                        onClick={() => navigate('/EditProfile')}
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
