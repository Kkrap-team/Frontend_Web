import { create } from 'zustand';

export const useFollowStore = create((set, get) => ({
  // 팔로우 상태를 저장하는 Map (userId -> following 상태)
  followStates: new Map(),
  
  // 특정 사용자의 팔로우 상태 설정
  setFollowState: (userId, isFollowing) => {
    set((state) => {
      const newFollowStates = new Map(state.followStates);
      newFollowStates.set(userId, isFollowing);
      return { followStates: newFollowStates };
    });
  },
  
  // 여러 사용자의 팔로우 상태를 한번에 설정
  setMultipleFollowStates: (followStatesArray) => {
    set((state) => {
      const newFollowStates = new Map(state.followStates);
      followStatesArray.forEach(({ userId, following }) => {
        newFollowStates.set(userId, following);
      });
      return { followStates: newFollowStates };
    });
  },
  
  // 특정 사용자의 팔로우 상태 가져오기
  getFollowState: (userId) => {
    return get().followStates.get(userId) || false;
  },
  
  // 팔로우 상태 변경 (팔로우/언팔로우)
  toggleFollowState: (userId) => {
    set((state) => {
      const newFollowStates = new Map(state.followStates);
      const currentState = newFollowStates.get(userId) || false;
      newFollowStates.set(userId, !currentState);
      return { followStates: newFollowStates };
    });
  },
  
  // 특정 사용자 팔로우 상태 제거
  removeFollowState: (userId) => {
    set((state) => {
      const newFollowStates = new Map(state.followStates);
      newFollowStates.delete(userId);
      return { followStates: newFollowStates };
    });
  },
  
  // 모든 팔로우 상태 초기화
  clearFollowStates: () => {
    set({ followStates: new Map() });
  },
}));
