import { useState, useEffect, useRef } from 'react';
import { searchFolders } from '../api/searchApi';

export const useSearchSuggestions = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    
    // 디바운싱을 위한 타이머
    const debounceTimer = useRef(null);
    // 로딩 타이머를 위한 참조
    const loadingTimerRef = useRef(null);

    const fetchSuggestions = async (query) => {
    
        
        if (!query.trim()) {
          
            setSuggestions([]);
            setLoading(false);
            setIsSearching(false);
            return;
        }

        try {
           
            setIsSearching(true);
            setLoading(true);
            setError(null);
            
            // 이전 로딩 타이머가 있다면 취소
            if (loadingTimerRef.current) {
                clearTimeout(loadingTimerRef.current);
            }
            
           
            const data = await searchFolders(query);
           
            
            // 결과를 즉시 표시
            setSuggestions(data || []);
           
            // 최소 로딩 시간 보장 (700ms)
            const minLoadingTime = 700;
            const startTime = performance.now();
            
            // 로딩 상태를 최소 시간까지 유지
            loadingTimerRef.current = setTimeout(() => {
                          setLoading(false);
            }, minLoadingTime);
            
        } catch (err) {
            console.error('검색 오류:', err);
            setError(err.message || '검색 중 오류가 발생했습니다.');
            setSuggestions([]);
            setLoading(false);
        } finally {
                       setIsSearching(false);
        }
    };

    const debouncedFetchSuggestions = (query) => {
        
        
        // 이전 타이머 취소
        if (debounceTimer.current) {
                    clearTimeout(debounceTimer.current);
        }
        
        // 새로운 타이머 설정 (300ms 디바운싱)
        debounceTimer.current = setTimeout(() => {
                    fetchSuggestions(query);
        }, 300);
    };

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            if (loadingTimerRef.current) {
                clearTimeout(loadingTimerRef.current);
            }
        };
    }, []);

    return {
        suggestions,
        loading,
        error,
        isSearching,
        fetchSuggestions: debouncedFetchSuggestions
    };
}; 