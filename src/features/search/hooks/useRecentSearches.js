import { useState, useEffect, useCallback } from 'react';

const RECENT_SEARCHES_KEY = 'kkrap_recent_searches';
const MAX_RECENT_SEARCHES = 10;

export const useRecentSearches = () => {
    const [recentSearches, setRecentSearches] = useState([]);

    // 로컬 스토리지에서 최근 검색어 불러오기
    const loadRecentSearches = useCallback(() => {
        try {
            const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (error) {
            console.error('최근 검색어 로드 오류:', error);
        }
        return [];
    }, []);

    // 로컬 스토리지에 최근 검색어 저장하기
    const saveRecentSearches = useCallback((searches) => {
        try {
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
        } catch (error) {
            console.error('최근 검색어 저장 오류:', error);
        }
    }, []);

    // 초기 로드
    useEffect(() => {
        const searches = loadRecentSearches();
        setRecentSearches(searches);
    }, [loadRecentSearches]);

    // 검색어 추가
    const addSearchTerm = useCallback((searchTerm) => {
        if (!searchTerm.trim()) return;

        setRecentSearches(prev => {
            // 중복 제거
            const filtered = prev.filter(term => term !== searchTerm);
            // 새로운 검색어를 맨 앞에 추가
            const newSearches = [searchTerm, ...filtered];
            // 최대 개수 제한
            const limited = newSearches.slice(0, MAX_RECENT_SEARCHES);
            
            // 로컬 스토리지에 저장
            saveRecentSearches(limited);
            
            return limited;
        });
    }, [saveRecentSearches]);

    // 검색어 제거
    const removeSearchTerm = useCallback((searchTerm) => {
        setRecentSearches(prev => {
            const newSearches = prev.filter(term => term !== searchTerm);
            saveRecentSearches(newSearches);
            return newSearches;
        });
    }, [saveRecentSearches]);

    // 모든 검색어 제거
    const clearAllSearches = useCallback(() => {
        setRecentSearches([]);
        saveRecentSearches([]);
    }, [saveRecentSearches]);

    return {
        recentSearches,
        addSearchTerm,
        removeSearchTerm,
        clearAllSearches
    };
};
