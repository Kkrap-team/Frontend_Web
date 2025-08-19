import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';

const useLogout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const { showConfirm } = useModal();

    return () => {
        showConfirm({
            title: '로그아웃',
            message: '로그아웃 하시겠습니까?',
            confirmText: '로그아웃',
            cancelText: '취소',
            confirmType: 'delete',
            onConfirm: () => {
                logout();
                navigate({ to: '/' });
            },
        });
    };
};

export default useLogout;
