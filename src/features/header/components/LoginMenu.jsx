import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from '@tanstack/react-router';
import useLogout from '../../auth/hooks/useLogout';

const url = import.meta.env.VITE_URL;

export default function LoginMenu() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const logout = useLogout();

    return (
        <div className="RightMenu">
            {user ? (
                <>
                    <img
                        src={`${user.profile.startsWith('http') ? user.profile : `${url}${user.profile}`}?t=${Date.now()}`}
                        alt="프로필"
                        className="HeaderProfileImage"
                        onClick={() => navigate({ to: '/editProfile' })}
                    />
                    <span className="Nickname">{user.nickname}님, 환영합니다.</span>
                    <button onClick={logout} className="LogoutButton">
                        로그아웃
                    </button>
                </>
            ) : (
                // 카카오 로그인 버튼 → 로그인 페이지로 네비게이션
                <button className="LoginButton" onClick={() => navigate({ to: '/login' })}>
                    카카오 로그인
                </button>
            )}
            <button className="MoreButton">⋮</button>
        </div>
    );
}
