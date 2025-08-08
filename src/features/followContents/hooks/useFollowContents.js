import { useState, useEffect } from 'react';
import { getFollowContents } from '../api/FollowContentsApi';

export default function useFollowContents() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFollowContents = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getFollowContents();
            setContents(data);
        } catch (err) {
            setError(err.message);
            console.error('팔로우 컨텐츠 로딩 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowContents();
    }, []);

    const refreshContents = () => {
        fetchFollowContents();
    };

    return {
        contents,
        loading,
        error,
        refreshContents,
    };
}
