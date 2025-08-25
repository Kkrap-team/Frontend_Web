import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 상태
      user: null,
      token: null,

      // 액션
      setUser: (user) => {
        set({ user });
        if (user) {
          localStorage.setItem('userProfile', JSON.stringify(user));
        } else {
          localStorage.removeItem('userProfile');
        }
      },

      // TODO: 배포 전 쿠키 기반으로 전환 (refreshToken 로컬 저장 제거)
      setTokens: (accessToken, refreshToken = null) => {
        const current = get().token;
        const previousRefreshToken = current ? current.refreshToken : null;
        const nextRefreshToken =
          refreshToken !== null && refreshToken !== undefined
            ? refreshToken
            : previousRefreshToken;

        // 액세스 토큰은 반드시 존재해야 함
        if (!accessToken || typeof accessToken !== 'string') {
          console.error('setTokens: 유효하지 않은 accessToken');
          throw new Error('INVALID_ACCESS_TOKEN');
        }

        const tokenData = {
          accessToken,
          refreshToken: nextRefreshToken ?? null,
        };
        set({ token: tokenData });
        localStorage.setItem('token', JSON.stringify(tokenData));
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
      },

      // AccessToken만 가져오기 (없으면 null 반환)
      getAccessToken: () => {
        const { token } = get();
        return token && token.accessToken ? token.accessToken : null;
      },

      // TODO: 배포 전 쿠키 기반으로 전환 시 제거 예정 (없으면 null 반환)
      getRefreshToken: () => {
        const { token } = get();
        return token && token.refreshToken ? token.refreshToken : null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token 
      }),
    }
  )
); 