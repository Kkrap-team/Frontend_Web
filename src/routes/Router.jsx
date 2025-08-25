import { createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useRef } from 'react';
import Header from '@/features/header/components/Header';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/stores/authStore';

import MainPage from '@/pages/MainPage/MainPage';
import LoginPage from '@/pages/loginPage/LoginPage';
import FollowerPage from '@/pages/FollowerPage/FollowerPage';
import EditProfilePage from '@/pages/userPage/EditProfilePage';
import StoragePage from '@/pages/storagePage/StoragePage';
import StorageFolderDetail from '@/pages/storageFolderDetail/StorageFolderDetail';
import SearchPage from '@/pages/SearchPage/SearchPage';

import { ModalProvider } from '@/contexts/ModalContext';
import ModalRenderer from '@/components/common/ModalRenderer';
import { useModal } from '@/contexts/ModalContext';

function RootPage() {
    const location = useLocation();
    const isLoginPath = location.pathname === '/login';
    const showHeader = !isLoginPath;
    return (
        <>
            <ModalProvider>
                {showHeader && <Header />}
                <Layout isLoginUI={isLoginPath}>{isLoginPath ? <LoginPage /> : <Outlet />}</Layout>
                <ModalRenderer />
            </ModalProvider>
        </>
    );
}

function useLoginGuardRedirect(message) {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { showConfirm } = useModal();
    const promptedRef = useRef(false);

    useEffect(() => {
        if (!user?.userId && !promptedRef.current) {
            promptedRef.current = true;
            showConfirm({
                title: '로그인 필요',
                message,
                confirmText: '로그인하러 가기',
                cancelText: '취소',
                confirmType: 'save',
                onConfirm: () => navigate({ to: '/login', replace: true }),
                // 취소 시 메인으로 돌려보냄
                onCancel: () => navigate({ to: '/', replace: true }),
            });
        }
    }, [user, navigate, showConfirm, message]);

    return Boolean(user?.userId);
}

function ProtectedStoragePage() {
    const isAuthed = useLoginGuardRedirect('보관함 페이지는 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?');
    if (!isAuthed) return null;
    return <StoragePage />;
}

function ProtectedFollowerPage() {
    const isAuthed = useLoginGuardRedirect('팔로우 페이지는 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?');
    if (!isAuthed) return null;
    return <FollowerPage />;
}

const rootRoute = createRootRoute({
    component: RootPage,
});

const mainRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: MainPage,
});

const storageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/storage/$userId',
    component: ProtectedStoragePage,
});

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
});

const followerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/follower',
    component: ProtectedFollowerPage,
});

const editProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/editProfile',
    component: EditProfilePage,
});

const folderDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/folder/$folderId',
    component: StorageFolderDetail,
});

const searchRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/search',
    component: SearchPage,
});

const notFoundRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '*',
    component: () => <div>페이지를 찾을 수 없습니다.</div>,
});

export const router = createRouter({
    routeTree: rootRoute.addChildren([
        mainRoute,
        loginRoute,
        storageRoute,
        editProfileRoute,
        folderDetailRoute,
        searchRoute,
        notFoundRoute,
        followerRoute,
    ]),
});

function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;
