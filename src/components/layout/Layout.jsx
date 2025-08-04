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
            }}
        >
            {children}
        </div>
    );
}
