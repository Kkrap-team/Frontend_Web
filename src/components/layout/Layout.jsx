import { useLocation } from '@tanstack/react-router';

export default function Layout({ children }) {
    const location = useLocation();
    
    //check :  FollowerPage에서 margin 뺐습니다.
    const isFollowerPage = location.pathname === '/follower';
    
    return (
        <div style={{ 
            margin: isFollowerPage ? '0' : '0 120px',
            height: isFollowerPage ? 'calc(100vh - 50px)' : '100vh',
            overflow: 'hidden'
        }}>
            {children}
        </div>
    );
}
