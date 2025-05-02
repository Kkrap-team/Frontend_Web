import { useContext } from 'react';
import { profileImageUpdateApi } from '../api/profileApi';
import { AuthContext } from '@/contexts/AuthContext';

export default function useProfileImageEdit() {
    const { user, setUser } = useContext(AuthContext);

    const changeImageHandler = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await profileImageUpdateApi(user.userId, formData);

            // 받아온 응답 전체를 상태로 업데이트
            setUser((prev) => ({
                ...prev,
                profile: res.profile,
                nickname: res.nickname,
                bio: res.bio,
                email: res.email,
                userId: res.userId,
                kakaoId: res.kakaoId,
            }));
        } catch (error) {
            console.error('이미지 변경 실패:', error);
            alert('이미지 업로드에 실패했습니다.');
        }
    };

    return { changeImageHandler };
}
