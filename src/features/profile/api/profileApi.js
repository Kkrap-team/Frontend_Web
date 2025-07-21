import axios from 'axios';

const url = import.meta.env.VITE_URL;

// 닉네임 중복 확인
export async function nicknameCheckApi(userId, nickname) {
    console.log('닉넴확인', userId, nickname);
    const res = await axios.get(`${url}/users/check-nickname`, {
        params: { nickname },
    });
    return res.data;
}

// 닉네임, 소개 변경
export async function profileFormUpdateApi(userId, nickname, bio) {
    console.log('닉변', userId, nickname, bio);
    const res = await axios.patch(
        `${url}/users/${userId}/profile`,
        { nickname, bio },
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
    return res.data;
}

// 프로필 이미지 업로드
export async function profileImageUpdateApi(userId, formData) {
    console.log('프로필이미지', userId, formData);
    const res = await axios.post(`${url}/users/${userId}/profile-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}
