// 사람이 읽기 쉬운 상대 시간 표시를 위한 유틸
// 예: 방금 전, 3분 전, 2시간 전, 5일 전, 2주 전, 3개월 전, 1년 전
export function formatRelativeKorean(input) {
    try {
        const target = new Date(input);
        if (Number.isNaN(target.getTime())) return '';

        const nowMs = Date.now();
        const diffSec = Math.max(0, Math.floor((nowMs - target.getTime()) / 1000));

        if (diffSec < 60) return '방금 전';
        const minutes = Math.floor(diffSec / 60);
        if (minutes < 60) return `${minutes}분 전`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}시간 전`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}일 전`;
        const weeks = Math.floor(days / 7);
        if (weeks < 5) return `${weeks}주 전`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months}개월 전`;
        const years = Math.floor(days / 365);
        return `${years}년 전`;
    } catch (_) {
        return '';
    }
}
