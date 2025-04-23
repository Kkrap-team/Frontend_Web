import React, { useContext } from 'react';
import '@/features/profile/styles/ProfileImageEdit.css';
import { AuthContext } from '@/contexts/AuthContext';

export default function ProfileImageEdit({ onImageChange }) {
    const { user } = useContext(AuthContext);
    const url = import.meta.env.VITE_URL;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            onImageChange(file);
        }
    };

    return (
        <div className="profile-image-edit">
            <label htmlFor="profileImageInput">
                <img src={`${url}${user.profile}?t=${Date.now()}`} alt="프로필" className="profile-preview" />
                <p className="change-image-text">프로필 사진 변경</p>
                {console.log('최종 이미지 경로:', `${url}${user.profile}?t=${Date.now()}`)}
            </label>
            <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
        </div>
    );
}
