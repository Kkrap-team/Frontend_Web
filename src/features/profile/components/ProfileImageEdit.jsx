import React, { useContext } from 'react';
import '@/features/profile/styles/ProfileImageEdit.css';
import { AuthContext } from '@/contexts/AuthContext';

export default function ProfileImageEdit({ changeImageHandler }) {
    const { user } = useContext(AuthContext);
    const url = import.meta.env.VITE_URL;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            changeImageHandler(file);
        }
    };

    return (
        <div className="ProfileImageArea">
            <label htmlFor="ProfileImageInput">
                <img src={`${url}${user.profile}?t=${Date.now()}`} alt="프로필" className="ProfileImage" />
                <p className="ChangeImageText">프로필 사진 변경</p>
                {console.log('최종 이미지 경로:', `${url}${user.profile}?t=${Date.now()}`)}
            </label>
            <input
                id="ProfileImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
        </div>
    );
}
