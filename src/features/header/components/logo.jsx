import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
    const navigate = useNavigate();

    return (
        <div className="logo" onClick={() => navigate('/')}>
            <img src="/Kkrap_logo.png" alt="크크랩 로고" className="logo-image" />
            <span className="logo-text1">크</span>
            <span className="logo-text2">크</span>
            <span className="logo-text1">랩</span>
        </div>
    );
};

export default Logo;
