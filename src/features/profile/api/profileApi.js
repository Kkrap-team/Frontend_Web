import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

// 현재 사용자 프로필 정보 가져오기
export async function getCurrentUserProfileApi() {
    const res = await api.get(`/users/me`);
    return res.data;
}

// 닉네임 중복 확인
export async function nicknameCheckApi(userId, nickname) {
    console.log('닉넴확인', userId, nickname);
    const res = await api.get(`${url}/users/check-nickname`, {
        params: { nickname },
    });
    return res.data;
}

// 닉네임, 소개 변경
export async function profileFormUpdateApi(userId, nickname, bio) {
    console.log('닉변', userId, nickname, bio);
    const res = await api.patch(`/users/profile`, { nickname, bio });
    return res.data;
}

//프로필 이미지 업로드
// export async function profileImageUpdateApi(userId, formData) {
//     console.log('프로필이미지', userId, formData);
//     const res = await axios.post(`${url}/users/${userId}/profile-image`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return res.data;
// }

// 현재 사용자 계정 삭제(회원탈퇴) 추후 추가해야함
export async function deleteCurrentUserApi() {
    const res = await api.delete(`${url}/`);
    return res.data;
}
