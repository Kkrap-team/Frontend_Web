import { createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import Header from '@/features/header/components/Header';
import Layout from '@/components/layout/layout';
import MainPage from '@/pages/MainPage/MainPage';
import LoginPage from '@/pages/LoginPage/LoginPage';
import FollowerPage from '@/pages/FollowerPage/FollowerPage';
import EditProfilePage from '@/pages/UserPage/EditProfilePage';
import { ModalProvider } from '@/contexts/ModalContext';
import ModalRenderer from '@/components/common/ModalRenderer';

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
    path: '/storage',
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

const notFoundRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '*',
    component: () => <div>페이지를 찾을 수 없습니다.</div>,
});

export const router = createRouter({
    routeTree: rootRoute.addChildren([mainRoute, loginRoute, storageRoute, editProfileRoute, notFoundRoute, followerRoute]),

});

function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;
