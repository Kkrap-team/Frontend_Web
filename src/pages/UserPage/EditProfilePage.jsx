import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from '@tanstack/react-router';

import useProfileEdit from '@/features/profile/hook/useProfileEdit';
import { getCurrentUserProfileApi } from '@/features/profile/api/profileApi';

import ProfileForm from '@/features/profile/components/ProfileForm';
import ProfileImageEdit from '@/features/profile/components/ProfileImageEdit';

export default function EditProfilePage() {
    const { user: authUser } = useAuthStore();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API를 통해 현재 사용자 프로필 정보 가져오기
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const profileData = await getCurrentUserProfileApi();
            setUserProfile(profileData);
        } catch (err) {
            console.error('프로필 정보 가져오기 실패:', err);
            setError('프로필 정보를 가져오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // 기본 사용자 데이터 (로딩 중이나 에러 시 사용)
    const defaultUser = {
        userId: authUser?.userId || 0,
        nickname: authUser?.nickname || '',
        profile: authUser?.profile || '',
        email: '',
        bio: ''
    };

    // 닉네임, 소개, 프로필 이미지 변경 hook - 항상 호출
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
    } = useProfileEdit(userProfile || defaultUser);

    // 프로필 수정 완료 후 최신 데이터 다시 가져오기
    const handleProfileUpdate = async () => {
        try {
            await onSubmit();
            // 프로필 수정 완료 후 최신 데이터 다시 가져오기
            await fetchUserProfile();
        } catch (error) {
            console.error('프로필 업데이트 실패:', error);
        }
    };

    // 로딩 중이거나 에러가 있을 때 처리
    if (loading) {
        return <div>프로필 정보를 불러오는 중...</div>;
    }

    if (error) {
        return <div>에러: {error}</div>;
    }

    if (!userProfile) {
        return <div>프로필 정보를 찾을 수 없습니다.</div>;
    }

    const formProps = {
        nickname,
        setNickname,
        email: userProfile.email,
        bio,
        setBio,
        isAvailable,
        message,
        checkDuplicateHandler,
        onSubmit: handleProfileUpdate,
        onCancel: () => navigate({ to: '..' }),
    };

    return (
        <div className="EditProfileArea">
            <ProfileImageEdit userProfile={userProfile} changeImageHandler={changeImageHandler} />
            <ProfileForm {...formProps} />
        </div>
    );
}
