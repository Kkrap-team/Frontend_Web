import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useNavigate } from '@tanstack/react-router';

import useProfileEdit from '@/features/profile/hook/useProfileEdit';

import ProfileForm from '@/features/profile/components/ProfileForm';
import ProfileImageEdit from '@/features/profile/components/ProfileImageEdit';

export default function EditProfilePage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // 닉네임, 소개, 프로필 이미지 변경 hook
    const {
        nickname,
        setNickname,
        bio,
        setBio,
        isAvailable,
        message,
        checkDuplicateHandler,
        onSubmit,
        changeImageHandler,
    } = useProfileEdit(user);

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
        onCancel: () => navigate({ to: '..' }),
    };

    return (
        <div className="EditProfileArea">
            <ProfileImageEdit changeImageHandler={changeImageHandler} />
            <ProfileForm {...formProps} />
        </div>
    );
}
