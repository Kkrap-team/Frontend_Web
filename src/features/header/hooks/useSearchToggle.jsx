import { useState, useCallback } from 'react';

const useSearchToggle = () => {
    const [showSearchInput, setShowSearchInput] = useState(false);
    
    const toggleSearch = useCallback(() => {
        const newState = !showSearchInput;
        setShowSearchInput(newState);
        
        // 검색 상태 변경을 이벤트로 알림
        document.dispatchEvent(new CustomEvent('searchToggle', {
            detail: { isOpen: newState }
        }));
    }, [showSearchInput]);
    
    return { showSearchInput, toggleSearch };
};

export default useSearchToggle;
