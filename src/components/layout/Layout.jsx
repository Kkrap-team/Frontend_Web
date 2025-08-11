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

    // 검색 오버레이가 열려있을 때 body 스크롤 막기 및 네비게이션 공간 조정
    useEffect(() => {
        if (isSearchOpen) {
            // 스크롤바 너비 계산
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            // body 스크롤 차단
            document.body.style.overflow = 'hidden';

            // 네비게이션에 스크롤바 공간만큼 오른쪽 여백 추가
            const header = document.querySelector('.Header');
            if (header) {
                header.style.paddingRight = `${scrollbarWidth}px`;
            }
        } else {
            // body 스크롤 복원
            document.body.style.overflow = 'unset';

            // 네비게이션 여백 제거
            const header = document.querySelector('.Header');
            if (header) {
                header.style.paddingRight = '0px';
            }
        }

        return () => {
            document.body.style.overflow = 'unset';
            const header = document.querySelector('.Header');
            if (header) {
                header.style.paddingRight = '0px';
            }
        };
    }, [isSearchOpen]);

    return (
        <div
            style={{
                margin: isFollowerPage ? '60px 0 0 0' : '60px 120px 0 120px',
                height: isFollowerPage ? 'calc(100vh - 110px)' : 'calc(100vh - 60px)',
                opacity: isSearchOpen ? 0 : 1,
                transition: isSearchOpen ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                pointerEvents: isSearchOpen ? 'none' : 'auto',
            }}
        >
            {children}
        </div>
    );
}
