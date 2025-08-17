import { createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import Header from '@/features/header/components/Header';
import Layout from '@/components/layout/Layout';

import MainPage from '@/pages/mainPage/MainPage';
import LoginPage from '@/pages/loginPage/LoginPage';

import FollowerPage from '@/pages/FollowerPage/FollowerPage';
import EditProfilePage from '@/pages/userPage/EditProfilePage';
import { ModalProvider } from '@/contexts/ModalContext';
import ModalRenderer from '@/components/common/ModalRenderer';
import StoragePage from '@/pages/storagePage/StoragePage';
import StorageFolderDetail from '@/pages/storageFolderDetail/StorageFolderDetail';
import SearchPage from '@/pages/SearchPage/SearchPage';

const rootRoute = createRootRoute({
    component: () => (
        <>
            <ModalProvider>
                <Header />
                <Layout>
                    <Outlet />
                </Layout>
                <ModalRenderer />
            </ModalProvider>
        </>
    ),
});

const mainRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: MainPage,
});

const storageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/storage/$userId',
    component: StoragePage,
});

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
});

const followerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/follower',
    component: FollowerPage,
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
