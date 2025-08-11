import React from "react";
import axios from "axios";
import { useAuthStore } from '@/stores/authStore';
import api from '@/utils/axiosConfig';

const url = import.meta.env.VITE_URL;

const TestToken = () => {
  const { token, user } = useAuthStore();

  const testCurrentToken = async () => {
    try {
      console.log('현재 Token 객체:', token);
      console.log('현재 사용자:', user);
      
      if (!token || !token.accessToken) {
        console.log('로그인해야함함');
        return;
      }

      const response = await api.get(`${url}/users/me`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });

      console.log('API 호출 성공:', response.data);
    } catch (error) {
      console.error('API 호출 실패:', error);
    }
  };

  const testLocalStorage = () => {
    const tokenData = localStorage.getItem('token');
    const userProfile = localStorage.getItem('userProfile');
    
    console.log('localStorage 확인:');
    console.log('Token:', tokenData);
    console.log('UserProfile:', userProfile);
    
    if (tokenData) {
      const parsedToken = JSON.parse(tokenData);
      console.log('Parsed Token:', parsedToken);
      console.log('AccessToken:', parsedToken.accessToken);
      console.log('RefreshToken:', parsedToken.refreshToken);
    }
  };

  const testRefreshToken = async () => {
    try {
      console.log('=== RefreshToken 테스트 시작 ===');
      
      // 1. 현재 토큰 상태 확인
      const currentToken = useAuthStore.getState().getAccessToken();
      const storedRefreshToken = useAuthStore.getState().getRefreshToken();
      console.log('현재 AccessToken:', currentToken);
      console.log('저장된 RefreshToken:', storedRefreshToken);
      
      // 2. localStorage 확인
      const tokenData = localStorage.getItem('token');
      console.log('localStorage Token:', tokenData);
      
      // 3. 요청 정보 확인
      const requestUrl = `${url}/api/auth/refresh`;
      console.log('요청 URL:', requestUrl);
      console.log('VITE_URL:', import.meta.env.VITE_URL);
      
      // 4. refreshToken 요청 테스트 (로컬스토리지 방식)
      console.log('RefreshToken 요청 시도...');
      const response = await axios.post(requestUrl, {
        refreshToken: storedRefreshToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('RefreshToken 응답:', response.data);
      console.log('응답 헤더:', response.headers);
      
      // 5. 새로운 토큰 저장
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      useAuthStore.getState().setTokens(accessToken, newRefreshToken);
      
      console.log('새로운 AccessToken:', accessToken);
      console.log('새로운 RefreshToken:', newRefreshToken);
      console.log('=== RefreshToken 테스트 완료 ===');
      
    } catch (error) {
      console.error('RefreshToken 테스트 실패:', error);
      console.error('에러 응답:', error.response?.data);
      console.error('에러 상태:', error.response?.status);
      console.error('에러 헤더:', error.response?.headers);
      console.error('요청 헤더:', error.config?.headers);
    }
  };

  const testInterceptor = async () => {
    try {
      console.log('=== 인터셉터 테스트 시작 ===');
      
      // 1. 현재 토큰 상태 확인
      const currentToken = useAuthStore.getState().getAccessToken();
      console.log('현재 AccessToken:', currentToken);
      
      if (!currentToken) {
        console.log('토큰이 없습니다. 먼저 로그인해주세요.');
        return;
      }
      
      // 2. 간단한 API 호출로 인터셉터 확인
      console.log('1. 간단한 API 호출로 인터셉터 확인...');
      try {
        const response = await api.get(`${url}/users/me`);
        console.log('API 호출 성공:', response.status);
        console.log('응답 데이터:', response.data);
      } catch (error) {
        console.log('API 호출 실패:', error.response?.status);
        console.log('에러 메시지:', error.response?.data);
      }
      
      // 3. 요청 인터셉터 확인
      console.log('2. 요청 인터셉터 확인');
      console.log('위의 로그에서 다음을 확인하세요:');
      console.log('- "요청 URL:", "요청 메서드:", "현재 AccessToken:"');
      console.log('- "요청 헤더:" (Authorization 헤더 포함 여부)');
      console.log('- "Authorization 헤더 추가됨:" 또는 "AccessToken이 없어서..."');
      
      // 4. 응답 인터셉터 확인
      console.log('3. 응답 인터셉터 확인');
      console.log('위의 로그에서 다음을 확인하세요:');
      console.log('- "응답 성공:" 또는 "응답 에러:"');
      
      console.log('=== 인터셉터 테스트 완료 ===');
      
    } catch (error) {
      console.error('인터셉터 테스트 실패:', error);
    }
  };

  const testManual401 = async () => {
    try {
      console.log('=== 수동 401 에러 테스트 시작 ===');
      
      // 1. 현재 토큰 확인
      const currentToken = useAuthStore.getState().getAccessToken();
      console.log('현재 AccessToken:', currentToken);
      
      if (!currentToken) {
        console.log('토큰이 없습니다. 먼저 로그인해주세요.');
        return;
      }
      
      // 2. 수동으로 401 에러 발생시키기
      console.log('수동으로 401 에러를 발생시키는 API 호출...');
      
      // 임시로 잘못된 토큰 설정
      const originalToken = currentToken;
      useAuthStore.getState().setTokens('invalid_token_for_testing', null);
      
      try {
        // 401 에러가 발생할 API 호출
        await api.get(`${url}/users/me`);
        console.log('예상과 다름: 401 에러가 발생하지 않았습니다.');
      } catch (error) {
        console.log('401 에러 발생:', error.response?.status);
        console.log('인터셉터가 자동으로 토큰 갱신을 시도합니다...');
        
        // 잠시 대기 후 결과 확인
        setTimeout(() => {
          const newToken = useAuthStore.getState().getAccessToken();
          console.log('갱신 시도 후 AccessToken:', newToken);
          
          // 원래 토큰으로 복원
          useAuthStore.getState().setTokens(originalToken, null);
          console.log('원래 토큰으로 복원 완료');
        }, 3000);
      }
      
      console.log('=== 수동 401 에러 테스트 완료 ===');
      
    } catch (error) {
      console.error('수동 401 에러 테스트 실패:', error);
    }
  };

  const testSimpleInterceptor = async () => {
    try {
      console.log('=== 간단한 인터셉터 테스트 시작 ===');
      
      // 1. 토큰 확인
      const currentToken = useAuthStore.getState().getAccessToken();
      console.log('현재 AccessToken:', currentToken);
      
      if (!currentToken) {
        console.log('토큰이 없습니다. 먼저 로그인해주세요.');
        return;
      }
      
      // 2. 간단한 GET 요청으로 인터셉터 확인
      console.log('간단한 GET 요청으로 인터셉터 확인...');
      const response = await api.get(`${url}/users/me`);
      console.log('요청 성공:', response.status);
      
      console.log('=== 간단한 인터셉터 테스트 완료 ===');
      
    } catch (error) {
      console.log('요청 실패:', error.response?.status);
      console.log('에러 메시지:', error.response?.data);
      console.log('=== 간단한 인터셉터 테스트 완료 (에러) ===');
    }
  };

  return (
    <div>
      <h3>토큰 테스트 도구</h3>
      
      <button onClick={testCurrentToken}>
        토큰 테스트
      </button>
      
      <button onClick={testLocalStorage}>
        localStorage 확인
      </button>

      <button onClick={testRefreshToken}>
        RefreshToken 테스트
      </button>

      <button onClick={testInterceptor}>
        인터셉터 테스트
      </button>

      <button onClick={testManual401}>
        수동 401 에러 테스트
      </button>

      <button onClick={testSimpleInterceptor}>
        간단한 인터셉터 테스트
      </button>
    </div>
  );
};

export default TestToken;