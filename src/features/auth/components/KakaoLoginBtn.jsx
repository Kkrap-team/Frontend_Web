import React from 'react';
// import { REST_API_KEY, REDIRECT_URI } from '../../../config/kakaoConfig';

const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;


console.log(REDIRECT_URI,REST_API_KEY)

const KakaoLoginButton = () => {
    const handleLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    };

    return <button onClick={handleLogin}>카카오로 로그인</button>;
};


export default KakaoLoginButton;
