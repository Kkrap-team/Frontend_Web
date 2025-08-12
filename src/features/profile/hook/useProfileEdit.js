import { useState, useContext, useEffect } from 'react';
import { nicknameCheckApi, profileFormUpdateApi} from '@/features/profile/api/profileApi';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from '@tanstack/react-router';

export default function useProfileEdit(initialUser) {
    const [nickname, setNickname] = useState(initialUser.nickname || '');
    const [bio, setBio] = useState(initialUser.bio || '');
    const [isAvailable, setIsAvailable] = useState(null);
    const [message, setMessage] = useState('');
    const { setUser } = useAuthStore();
    const navigate = useNavigate();

    // initialUser가 변경될 때마다 로컬 상태 업데이트
    useEffect(() => {
        setNickname(initialUser.nickname || '');
        setBio(initialUser.bio || '');
    }, [initialUser.nickname, initialUser.bio]);

    useEffect(() => {
        setIsAvailable(null);
        setMessage('');
    }, [nickname]);

    const checkDuplicateHandler = async () => {
        if (nickname === initialUser.nickname) {
            setIsAvailable(true);
            setMessage('현재 사용 중인 닉네임입니다.');
            return;
        }

        try {
            await nicknameCheckApi(initialUser.userId, nickname);
            setIsAvailable(true);
            setMessage('사용 가능한 닉네임입니다.');
        } catch (error) {
            if (error.response?.status === 409) {
                setIsAvailable(false);
                setMessage('이미 사용 중인 닉네임입니다.');
            } else {
                setMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
                console.error(error);
            }
        }
    };

    // 닉네임, 소개 변경 저장
    const onSubmit = async () => {
        const isNicknameChanged = nickname !== initialUser.nickname;
        const isBioChanged = bio !== initialUser.bio;

        // 닉네임이 바뀌었고 중복 상태면 저장 막기
        if (isNicknameChanged && isAvailable === false) {
            alert('이미 사용 중인 닉네임입니다.');
            return;
        }

        // 닉네임이 바뀌었는데 중복확인 안 했으면 저장 막기
        if (isNicknameChanged && isAvailable === null) {
            alert('닉네임 중복 확인을 해주세요.');
            return;
        }

        // 닉네임과 소개 둘 다 안 바뀌었으면 저장 막기
        if (!isNicknameChanged && !isBioChanged) {
            alert('변경된 내용이 없습니다.');
            return;
        }

        try {
            const res = await profileFormUpdateApi(initialUser.userId, nickname, bio);
            alert('프로필이 저장되었습니다!');
            
            // store의 user 정보 업데이트 (email과 bio는 제외)
            const updatedUser = {
                ...initialUser,
                nickname: res.nickname,
                bio: res.bio,
            };
          
            setUser(updatedUser);
            
            // navigate({ to: '/editProfile' });
        } catch (error) {
            alert('프로필 저장 중 오류가 발생했습니다.');
            console.error('저장 실패:', error);
        }
    };

    // const changeImageHandler = async (file) => {
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     try {
    //         const res = await profileImageUpdateApi(initialUser.userId, formData);

    //         setUser((prev) => ({
    //             ...prev,
    //             profile: res.profile,
    //             nickname: res.nickname,
    //             bio: res.bio,
    //             email: res.email,
    //             userId: res.userId,
    //             kakaoId: res.kakaoId,
    //         }));
    //     } catch (error) {
    //         console.error('이미지 변경 실패:', error);
    //         alert('이미지 업로드에 실패했습니다.');
    //     }
    // };

    return {
        nickname,
        setNickname,
        bio,
        setBio,
        isAvailable,
        message,
        checkDuplicateHandler,
        onSubmit,
        // changeImageHandler,
    };
}
