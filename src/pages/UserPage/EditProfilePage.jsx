import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

import useProfileFormEdit from '@/features/profile/hook/useProfileFormEdit';
import useProfileImageEdit from '@/features/profile/hook/useProfileImageEdit';

import ProfileForm from '@/features/profile/components/ProfileForm';
import ProfileImageEdit from '@/features/profile/components/ProfileImageEdit';

export default function EditProfilePage() {
    const { user } = useContext(AuthContext);

    // 닉네임/소개 관련 hook
    const { nickname, setNickname, bio, setBio, isAvailable, message, onCheckDuplicate, onSubmit } =
        useProfileFormEdit(user);

    // 프로필 이미지 변경 hook
    const { onImageChange } = useProfileImageEdit();

    return (
        <div className="edit-profile-page">
            <h2>프로필 수정</h2>

            <ProfileImageEdit onImageChange={onImageChange} />

            <ProfileForm
                nickname={nickname}
                setNickname={setNickname}
                email={user.email}
                bio={bio}
                setBio={setBio}
                isAvailable={isAvailable}
                message={message}
                onCheckDuplicate={onCheckDuplicate}
                onSubmit={onSubmit}
                onCancel={() => window.history.back()}
            />
        </div>
    );
}
