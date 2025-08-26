import React from 'react';
import '@/features/profile/styles/AccountSettingsModal.css';
import { useNavigate } from '@tanstack/react-router';
import useLogout from '@/features/auth/hooks/useLogout';
import { deleteCurrentUserApi } from '@/features/profile/api/profileApi';
import { useModal } from '@/contexts/ModalContext';

const AccountSettingsModal = ({ onClose }) => {
    const navigate = useNavigate();
    const logout = useLogout();
    const { showConfirm } = useModal();

    const handleEditProfile = () => {
        navigate({ to: '/editProfile' });
        onClose?.();
    };

    const handleLogout = () => {
        logout();
        onClose?.();
    };

    const handleWithdraw = () => {
        showConfirm({
            title: '회원탈퇴',
            message: '정말로 회원탈퇴 하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
            confirmText: '탈퇴',
            cancelText: '취소',
            confirmType: 'delete',
            onConfirm: async () => {
                try {
                    await deleteCurrentUserApi();
                    logout();
                    onClose?.();
                } catch (e) {
                    console.error(e);
                }
            },
        });
    };

    return (
        <div className="AccountSettingsOverlay" onClick={onClose}>
            <div className="AccountSettingsModal" onClick={(e) => e.stopPropagation()}>
                <div className="AccountSettingsTitle">계정 설정</div>
                <ul className="AccountSettingsList">
                    <li>
                        <button type="button" onClick={handleEditProfile}>
                            프로필 수정
                        </button>
                    </li>
                    <li className="LogoutItem">
                        <button type="button" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </li>
                    <li>
                        <button type="button" className="danger" onClick={handleWithdraw}>
                            회원탈퇴
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AccountSettingsModal;
