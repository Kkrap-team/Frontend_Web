import React from 'react';
import useKakaoLogin from '../../features/auth/hooks/userKakaoLogin';

const LoginPage = () => {
    useKakaoLogin();

    return <div>로그인 중입니다...</div>;
};

export default LoginPage;
