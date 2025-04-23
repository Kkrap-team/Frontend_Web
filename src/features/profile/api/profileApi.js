import api from '@/components/axios/axios';

// 닉네임 중복 확인
export async function checkNickname(userId, nickname) {
    console.log('닉넴확인', userId, nickname);
    const res = await api.get('/users/check-nickname', {
        params: { nickname },
    });
    return res.data;
}

// 닉네임, 소개 변경
export async function updateNickname(userId, nickname, bio) {
    console.log('닉변', userId, nickname, bio);
    const res = await api.patch(
        `/users/${userId}/profile`,
        { nickname, bio },
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
    return res.data;
}

// 프로필 이미지 업로드
export async function uploadProfileImageAPI(userId, formData) {
    console.log('프로필이미지', userId, formData);
    const res = await api.post(`/users/${userId}/profile-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}
