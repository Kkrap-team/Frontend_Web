import { useLocation } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    //check :  FollowerPage에서 margin 뺐습니다.
    const isFollowerPage = location.pathname === '/follower';

    // 검색 오버레이 상태 감지
    useEffect(() => {
        const handleSearchToggle = (event) => {
            if (event.detail && typeof event.detail.isOpen === 'boolean') {
                setIsSearchOpen(event.detail.isOpen);
            }
        };

        document.addEventListener('searchToggle', handleSearchToggle);
        return () => document.removeEventListener('searchToggle', handleSearchToggle);
    }, []);
    
    return (
        <div 
            style={{ 
                margin: isFollowerPage ? '60px 0 0 0' : '60px 120px 0 120px',
                height: isFollowerPage ? 'calc(100vh - 110px)' : 'calc(100vh - 60px)',
                overflow: 'hidden',
                opacity: isSearchOpen ? 0 : 1,
                transform: isSearchOpen ? 'translateY(20px)' : 'translateY(0)',
                transition: isSearchOpen ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                pointerEvents: isSearchOpen ? 'none' : 'auto'
            }}
        >
            {children}
        </div>
    );
}
