import { useState, useCallback, useRef } from 'react';
import { searchFolders } from '../api/searchApi';

export const useSearchSuggestions = (debounceTime = 300) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const timeoutRef = useRef(null);

    const fetchSuggestions = useCallback(async (query) => {
        // 이전 타이머 클리어
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 디바운싱 적용
        timeoutRef.current = setTimeout(async () => {
            if (!query.trim()) {
                setSuggestions([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const results = await searchFolders(query);
                setSuggestions(results || []);
            } catch (err) {
                console.error('검색 추천 오류:', err);
                setError(err.message);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, debounceTime);
    }, [debounceTime]);

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
        setLoading(false);
        setError(null);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return {
        suggestions,
        loading,
        error,
        fetchSuggestions,
        clearSuggestions
    };
}; 