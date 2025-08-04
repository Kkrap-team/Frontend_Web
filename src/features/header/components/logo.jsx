import React from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function Logo() {
    const navigate = useNavigate();

    return (
        <div className="Logo" onClick={() => navigate({ to: '/' })}>
            <img src="/Kkrap_logo.png" alt="크크랩 로고" className="LogoImage" />
            <span className="LogoText1">크</span>
            <span className="LogoText2">크</span>
            <span className="LogoText1">랩</span>
        </div>
    );
}
