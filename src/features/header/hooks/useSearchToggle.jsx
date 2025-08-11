import { useState, useCallback, useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

const useSearchToggle = () => {
    const [showSearchInput, setShowSearchInput] = useState(false);
    const location = useLocation();
    
    const toggleSearch = useCallback(() => {
        const newState = !showSearchInput;
        setShowSearchInput(newState);
        
        // 검색 상태 변경을 이벤트로 알림
        document.dispatchEvent(new CustomEvent('searchToggle', {
            detail: { isOpen: newState }
        }));
    }, [showSearchInput]);

    // 라우터 위치 변경 시 검색 오버레이 자동 닫기
    useEffect(() => {
        if (showSearchInput) {
            setShowSearchInput(false);
        }
    }, [location.pathname, location.search]);
    
    return { showSearchInput, toggleSearch };
};

export default useSearchToggle;
