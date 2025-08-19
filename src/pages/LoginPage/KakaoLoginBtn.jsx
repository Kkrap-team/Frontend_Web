import React from 'react';

const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const KakaoLoginButton = ({ className = 'KakaoBtn'}) => {
    const handleLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
    };

    return (

        <button type="submit" className={className} >
                <img
                  src="/kakaotalk_login_logo.png"
                  alt="카카오 로그인"
                  className="KakaoLogo"
                  onClick={handleLogin}
                />
              </button>
    );
};

export default KakaoLoginButton;
