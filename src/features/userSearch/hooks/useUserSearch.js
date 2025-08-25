import { useState, useEffect } from 'react';
import { searchUsers } from '../api/userSearchApi';
import { useFollowStore } from '@/stores/followStore';

export function useUserSearch(debounceTime = 300) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // 전역 스토어에서 팔로우 상태 설정 함수 가져오기
    const { setMultipleFollowStates } = useFollowStore();

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setError(null);
            setLoading(false); // 로딩 상태를 false로 설정
            return;
        }
        
        setLoading(true);
        setError(null);
        
        const handler = setTimeout(async () => {
            try {
                const users = await searchUsers(query);
                setResults(users || []);
                
                // 검색 결과의 팔로우 상태를 전역 스토어에 설정
                if (users && Array.isArray(users)) {
                    const followStates = users.map(user => ({
                        userId: user.userId,
                        following: user.following || false
                    }));
                    setMultipleFollowStates(followStates);
                }
            } catch (error) {
                console.error('사용자 검색 오류:', error);
                setError(error.message);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, debounceTime);
        
        return () => clearTimeout(handler);
    }, [query, debounceTime, setMultipleFollowStates]);

    return { query, setQuery, results, loading, error };
}