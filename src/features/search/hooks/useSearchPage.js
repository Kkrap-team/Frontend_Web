import { useState, useEffect, useCallback, useRef } from 'react';
import { searchFoldersByEnter } from '../api/searchApi';

export const useSearchPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const previousSearchTerm = useRef('');
    
    const fetchResults = useCallback(async (term) => {
        if (term) {
            setLoading(true);
            setError(null);
            try {
                const data = await searchFoldersByEnter(term);
                setResults(data);
            } catch (err) {
                setError('검색 중 오류가 발생했습니다.');
                console.error('검색 오류:', err);
            } finally {
                setLoading(false);
            }
        }
    }, []);
    
    // URL에서 검색어를 가져오는 함수
    const getSearchTermFromUrl = useCallback(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        return urlSearchParams.get('term');
    }, []);
    
    // 검색어가 변경되었는지 확인하고 필요시 업데이트
    const checkAndUpdateSearchTerm = useCallback(() => {
        const currentTerm = getSearchTermFromUrl();
        if (currentTerm && currentTerm !== previousSearchTerm.current) {
            previousSearchTerm.current = currentTerm;
            setSearchTerm(currentTerm);
        }
    }, [getSearchTermFromUrl]);
    
    useEffect(() => {
        // 초기 검색어 설정
        const initialTerm = getSearchTermFromUrl();
        if (initialTerm) {
            previousSearchTerm.current = initialTerm;
            setSearchTerm(initialTerm);
        }
        
        // popstate 이벤트 리스너 추가 (브라우저 뒤로가기/앞으로가기)
        const handlePopState = () => {
            setTimeout(checkAndUpdateSearchTerm, 100);
        };
        
        // pushstate/replacestate 이벤트 감지 (프로그래밍 방식 URL 변경)
        const handleUrlChange = () => {
            setTimeout(checkAndUpdateSearchTerm, 100);
        };
        
        // history API 변경 감지
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            handleUrlChange();
        };
        
        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            handleUrlChange();
        };
        
        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
            // 원래 함수 복원
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
        };
    }, [checkAndUpdateSearchTerm]);
    
    // URL 변경을 주기적으로 확인 (100ms마다)
    useEffect(() => {
        const intervalId = setInterval(checkAndUpdateSearchTerm, 100);
        return () => clearInterval(intervalId);
    }, [checkAndUpdateSearchTerm]);
    
    useEffect(() => {
        if (searchTerm) {
            fetchResults(searchTerm);
        }
    }, [searchTerm, fetchResults]);
    
    // 수동으로 검색어를 설정하는 함수 (필요시 사용)
    const setSearchTermManually = useCallback((term) => {
        previousSearchTerm.current = term;
        setSearchTerm(term);
    }, []);
    
    // 검색 결과를 다시 가져오는 함수
    const refetchResults = useCallback(() => {
        if (searchTerm) {
            fetchResults(searchTerm);
        }
    }, [searchTerm, fetchResults]);
    
    return {
        results,
        loading,
        error,
        searchTerm,
        setSearchTerm: setSearchTermManually,
        refetchResults
    };
};
