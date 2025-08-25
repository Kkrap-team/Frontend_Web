import React from 'react';
import useKakaoLogin from '../../features/auth/hooks/userKakaoLogin';
import './LoginPage.css';
import KakaoLoginButton from './KakaoLoginBtn';

const LoginPage = () => {
    // 카카오 로그인 훅 (리다이렉트 등 사이드이펙트가 있다면 그대로 동작)
    useKakaoLogin();

    return (
        <div className="LoginPage">
            <main className="MainWrapper">
                <section id="Mobile" className="MobileSection" />
                <section id="Auth" className="AuthSection">
                    <div className="LoginPanel">
                        <h1 title="Instagram" className="LogoWrapper">
                            <img
                                src="/Kkrap_logo_large.png"
                                alt="Instagram logo"
                                title="Instagram logo"
                                className="LogoImg"
                            />
                        </h1>

                        <p className="LogoSubtitle">
                            대한민국 <span className="Highlight">1등</span> 링크 저장소
                        </p>

                        <div className="SeparatorWrapper">
                            <span></span>
                            <div className="Or">OU</div>
                            <span></span>
                        </div>

                        {/* 카카오 로그인 버튼 */}
                        <KakaoLoginButton />
                    </div>

                    {/* <div className="RegisterPanel">
            <p>다시 돌아가고 싶으신가요?</p>
            <a
              href="https://kkrap-team.github.io/kkrap/"
              target="_blank"
              rel="noopener noreferrer"
            >
              kkrap 홈으로 이동
            </a>
          </div> */}

                    <div className="RegisterPanel">
                        <div className="ReturnRow">
                            <span className="ReturnLabel">다시 돌아가고 싶으신가요?</span>
                            <a
                                className="ReturnButton"
                                href="https://kkrap-team.github.io/kkrap/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                kkrap 홈으로 이동
                            </a>
                        </div>
                    </div>

                    <div className="KkrapFooter">
                        크<span className="Highlight">크</span>랩
                    </div>
                </section>
            </main>

            <footer>
                <p className="Copyright">© 2025 kkrap</p>
            </footer>
        </div>
    );
};

export default LoginPage;
