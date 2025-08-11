import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';

const useLogout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    return () => {
        logout(); // AuthStore의 logout 함수 사용
        alert('로그아웃 되었습니다.');
        navigate({ to: '/' });
    };
};

export default useLogout;
