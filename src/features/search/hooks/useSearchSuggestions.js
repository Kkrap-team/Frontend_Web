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
        console.log('fetchSuggestions 호출:', query);
        
        if (!query.trim()) {
            console.log('빈 쿼리, 상태 초기화');
            setSuggestions([]);
            setLoading(false);
            setIsSearching(false);
            return;
        }

        try {
            console.log('검색 시작 - 로딩 상태 설정');
            setIsSearching(true);
            setLoading(true);
            setError(null);
            
            // 이전 로딩 타이머가 있다면 취소
            if (loadingTimerRef.current) {
                clearTimeout(loadingTimerRef.current);
            }
            
            console.log('API 호출 시작');
            const data = await searchFolders(query);
            console.log('API 응답 받음:', data);
            
            // 결과를 즉시 표시
            setSuggestions(data || []);
            console.log('suggestions 상태 업데이트:', data || []);
            
            // 최소 로딩 시간 보장 (700ms)
            const minLoadingTime = 700;
            const startTime = performance.now();
            
            // 로딩 상태를 최소 시간까지 유지
            loadingTimerRef.current = setTimeout(() => {
                console.log('최소 로딩 시간 완료, 로딩 상태 해제');
                setLoading(false);
            }, minLoadingTime);
            
        } catch (err) {
            console.error('검색 오류:', err);
            setError(err.message || '검색 중 오류가 발생했습니다.');
            setSuggestions([]);
            setLoading(false);
        } finally {
            console.log('검색 완료 - isSearching 해제');
            setIsSearching(false);
        }
    };

    const debouncedFetchSuggestions = (query) => {
        console.log('debouncedFetchSuggestions 호출:', query);
        
        // 이전 타이머 취소
        if (debounceTimer.current) {
            console.log('이전 타이머 취소');
            clearTimeout(debounceTimer.current);
        }
        
        // 새로운 타이머 설정 (300ms 디바운싱)
        debounceTimer.current = setTimeout(() => {
            console.log('디바운싱 완료, 실제 검색 실행');
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