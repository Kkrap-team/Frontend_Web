import React from 'react';

const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

console.log(REDIRECT_URI, REST_API_KEY);

const KakaoLoginButton = ({ className }) => {
    const handleLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    };

    return (
        <button className={className} onClick={handleLogin}>
            카카오 로그인
        </button>
    );
};

export default KakaoLoginButton;
