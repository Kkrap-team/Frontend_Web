import { useState, useEffect } from 'react';
import { searchUsers } from '../api/userSearchApi';

export function useUserSearch(debounceTime = 300) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setError(null);
            return;
        }
        
        setLoading(true);
        setError(null);
        
        const handler = setTimeout(async () => {
            try {
                const users = await searchUsers(query);
                setResults(users || []);
            } catch (error) {
                console.error('사용자 검색 오류:', error);
                setError(error.message);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, debounceTime);
        
        return () => clearTimeout(handler);
    }, [query, debounceTime]);

    return { query, setQuery, results, loading, error };
}