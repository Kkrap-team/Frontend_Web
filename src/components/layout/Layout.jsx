import { useLocation } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import './Layout.css'; // 새 CSS 파일 추가

export default function Layout({ children, isLoginUI = false }) {
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const isFollowerPage = location.pathname === '/follower';
    const isLoginPage = isLoginUI;

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

    // 라우터 위치 변경 시 검색 오버레이 상태 초기화
    useEffect(() => {
        if (isSearchOpen) {
            setIsSearchOpen(false);
        }
    }, [location.pathname, location.search]);

    // 검색 오버레이 열렸을 때 body 스크롤 막기
    useEffect(() => {
        if (isSearchOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';

            const header = document.querySelector('.Header');
            if (header) {
                if (scrollbarWidth > 0) {
                    const computedRight = parseFloat(window.getComputedStyle(header).paddingRight) || 0;
                    header.style.paddingRight = `${computedRight + scrollbarWidth}px`;
                } else {
                    header.style.removeProperty('padding-right');
                }
            }
        } else {
            document.body.style.overflow = 'unset';
            const header = document.querySelector('.Header');
            if (header) header.style.removeProperty('padding-right');
        }

        return () => {
            document.body.style.overflow = 'unset';
            const header = document.querySelector('.Header');
            if (header) header.style.removeProperty('padding-right');
        };
    }, [isSearchOpen]);

    // 클래스 이름 조합
    const classNames = [
        'AppLayout',
        isLoginPage ? 'login' : isFollowerPage ? 'follower' : 'default',
        isSearchOpen ? 'search-open' : 'search-closed',
    ].join(' ');

    return <div className={classNames}>{children}</div>;
}

// import { useLocation } from '@tanstack/react-router';
// import { useState, useEffect } from 'react';

// export default function Layout({ children, isLoginUI = false }) {
//     const location = useLocation();
//     const [isSearchOpen, setIsSearchOpen] = useState(false);

//     //check :  FollowerPage에서 margin 뺐습니다.
//     const isFollowerPage = location.pathname === '/follower';
//     const isLoginPage = isLoginUI;

//     // 검색 오버레이 상태 감지
//     useEffect(() => {
//         const handleSearchToggle = (event) => {
//             if (event.detail && typeof event.detail.isOpen === 'boolean') {
//                 setIsSearchOpen(event.detail.isOpen);
//             }
//         };

//         document.addEventListener('searchToggle', handleSearchToggle);
//         return () => document.removeEventListener('searchToggle', handleSearchToggle);
//     }, []);

//     // 라우터 위치 변경 시 검색 오버레이 상태 즉시 초기화
//     useEffect(() => {
//         if (isSearchOpen) {
//             setIsSearchOpen(false);
//         }
//     }, [location.pathname, location.search]);

//     // 검색 오버레이가 열려있을 때 body 스크롤 막기 및 네비게이션 공간 조정
//     useEffect(() => {
//         if (isSearchOpen) {
//             // 스크롤바 너비 계산
//             const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

//             // body 스크롤 차단
//             document.body.style.overflow = 'hidden';

//             // 네비게이션에 스크롤바 공간만큼 오른쪽 여백 추가
//             const header = document.querySelector('.Header');
//             if (header) {
//                 header.style.paddingRight = `${scrollbarWidth}px`;
//             }
//         } else {
//             // body 스크롤 복원
//             document.body.style.overflow = 'unset';

//             // 네비게이션 여백 제거
//             const header = document.querySelector('.Header');
//             if (header) {
//                 header.style.paddingRight = '0px';
//             }
//         }

//         return () => {
//             document.body.style.overflow = 'unset';
//             const header = document.querySelector('.Header');
//             if (header) {
//                 header.style.paddingRight = '0px';
//             }
//         };
//     }, [isSearchOpen]);

//     return (
//         <div
//             style={{
//                 margin: isLoginPage ? '0' : isFollowerPage ? '60px 0 0 0' : '60px 120px 0 120px',
//                 // margin: isFollowerPage || isLoginPage ? '60px 0 0 0' : '60px 120px 0 120px',
//                 overflow: isLoginPage ? 'hidden' : 'visible',
//                 // height: isFollowerPage ? 'calc(100vh - 110px)' : 'calc(100vh - 60px)',
//                 height: isLoginPage ? '100vh' : isFollowerPage ? 'calc(100vh - 110px)' : 'calc(100vh - 60px)',
//                 opacity: isSearchOpen ? 0 : 1,
//                 transition: isSearchOpen ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
//                 pointerEvents: isSearchOpen ? 'none' : 'auto',
//                 visibility: isSearchOpen ? 'hidden' : 'visible',
//             }}
//         >
//             {children}
//         </div>
//     );
// }
