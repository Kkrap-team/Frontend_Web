import { useState, useEffect } from 'react';
import { nicknameCheckApi, profileFormUpdateApi } from '@/features/profile/api/profileApi';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';

export default function useProfileEdit(initialUser) {
    const [nickname, setNickname] = useState(initialUser.nickname || '');
    const [bio, setBio] = useState(initialUser.bio || '');
    const [isAvailable, setIsAvailable] = useState(null);
    const [message, setMessage] = useState('');
    const { setUser } = useAuthStore();
    const { showConfirm } = useModal();

    const NICKNAME_MAX = 10;

    // initialUser 변경 시 폼 값 동기화 + 중복확인 상태 초기화
    useEffect(() => {
        setNickname(initialUser.nickname || '');
        setBio(initialUser.bio || '');
        setIsAvailable(null);
        setMessage('');
    }, [initialUser.nickname, initialUser.bio]);

    // 닉네임이 바뀌면 중복확인 상태 초기화
    useEffect(() => {
        setIsAvailable(null);
        setMessage('');
    }, [nickname]);

    const checkDuplicateHandler = async () => {
        const trimmed = (nickname || '').trim();
        if (trimmed.length === 0) {
            setIsAvailable(false);
            setMessage('닉네임을 입력해주세요.');
            return;
        }
        if (trimmed.length > NICKNAME_MAX) {
            setIsAvailable(false);
            setMessage(`닉네임은 ${NICKNAME_MAX}자 이내로 입력해주세요.`);
            return;
        }

        if (trimmed === (initialUser.nickname || '')) {
            // 현재 사용 중인 닉네임: 성공/실패가 아닌 정보성 상태로 표시
            setIsAvailable(null);
            setMessage('현재 사용 중인 닉네임입니다.');
            return;
        }

        try {
            await nicknameCheckApi(initialUser.userId, trimmed);
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
        const trimmed = (nickname || '').trim();
        const isNicknameChanged = trimmed !== (initialUser.nickname || '');
        const isBioChanged = bio !== (initialUser.bio || '');

        // 유효성 검사: 빈값/길이
        if (isNicknameChanged) {
            if (trimmed.length === 0) {
                showConfirm({
                    title: '알림',
                    message: '닉네임을 입력해주세요.',
                    confirmText: '확인',
                    confirmType: 'save',
                });
                return;
            }
            if (trimmed.length > NICKNAME_MAX) {
                showConfirm({
                    title: '알림',
                    message: `닉네임은 ${NICKNAME_MAX}자 이내로 입력해주세요.`,
                    confirmText: '확인',
                    confirmType: 'save',
                });
                return;
            }
        }

        // 닉네임이 바뀌었고 중복 상태면 저장 막기
        if (isNicknameChanged && isAvailable === false) {
            showConfirm({
                title: '알림',
                message: '이미 사용 중인 닉네임입니다.',
                confirmText: '확인',
                confirmType: 'save',
            });
            return;
        }

        // 닉네임이 바뀌었는데 중복확인 안 했으면 저장 막기
        if (isNicknameChanged && isAvailable === null) {
            showConfirm({
                title: '알림',
                message: '닉네임 중복 확인을 해주세요.',
                confirmText: '확인',
                confirmType: 'save',
            });
            return;
        }

        // 닉네임과 소개 둘 다 안 바뀌었으면 저장 막기
        if (!isNicknameChanged && !isBioChanged) {
            showConfirm({
                title: '알림',
                message: '변경된 내용이 없습니다.',
                confirmText: '확인',
                confirmType: 'save',
            });
            return;
        }

        try {
            const res = await profileFormUpdateApi(initialUser.userId, trimmed, bio);
            showConfirm({
                title: '완료',
                message: '프로필이 저장되었습니다!',
                confirmText: '확인',
                confirmType: 'save',
            });
            const updatedUser = {
                ...initialUser,
                nickname: res.nickname,
                bio: res.bio,
            };
            setUser(updatedUser);
            // 저장 완료 후 메시지/중복확인 상태 초기화
            setIsAvailable(null);
            setMessage('');
        } catch (error) {
            showConfirm({
                title: '오류',
                message: '프로필 저장 중 오류가 발생했습니다.',
                confirmText: '확인',
                confirmType: 'delete',
            });
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
        nicknameMax: NICKNAME_MAX,
    };
}
