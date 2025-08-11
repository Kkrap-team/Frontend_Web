import React from "react";
import KakaoLoginButton from "../../features/auth/components/KakaoLoginBtn";
import TestToken from "@/features/auth/components/testToken";
function MainPage() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <KakaoLoginButton/>
      <TestToken/>
    </div>
  );
}

export default MainPage;
