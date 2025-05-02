import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import useProfileFormEdit from '@/features/profile/hook/useProfileFormEdit';
import useProfileImageEdit from '@/features/profile/hook/useProfileImageEdit';

import ProfileForm from '@/features/profile/components/ProfileForm';
import ProfileImageEdit from '@/features/profile/components/ProfileImageEdit';


export default function EditProfilePage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // 닉네임/소개 관련 hook
    const { nickname, setNickname, bio, setBio, isAvailable, message, checkDuplicateHandler, onSubmit } =
        useProfileFormEdit(user);

    // 프로필 이미지 변경 hook
    const { changeImageHandler } = useProfileImageEdit();

    const formProps = {
        nickname,
        setNickname,
        email: user.email,
        bio,
        setBio,
        isAvailable,
        message,
        checkDuplicateHandler,
        onSubmit,
        onCancel: () => navigate(-1),
    };

    return (
        <div className="EditProfileArea">
            <ProfileImageEdit changeImageHandler={changeImageHandler} />
            <ProfileForm {...formProps} />
        </div>
    );
}
