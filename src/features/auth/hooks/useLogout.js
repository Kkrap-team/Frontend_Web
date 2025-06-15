import { useContext } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AuthContext } from '@/contexts/AuthContext';

const useLogout = () => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    return () => {
        setUser(null);
        //localStorage.removeItem('user');  -> 토큰을 로컬스토리지에 저장할 시 사용 예정.
        alert('로그아웃 되었습니다.'); // 로그아웃 판단 용으로 잠시 사용
        navigate({ to: '/' });
    };
};

export default useLogout;
