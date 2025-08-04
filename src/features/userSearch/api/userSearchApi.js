const url = import.meta.env.VITE_URL;

export async function searchUsers(keyword) {
    try {
        const response = await fetch(
            `${url}/follows/search?nickname=${encodeURIComponent(keyword)}`,
            {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`사용자 검색 오류: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw new Error('사용자 검색 중 오류가 발생했습니다.');
    }
}