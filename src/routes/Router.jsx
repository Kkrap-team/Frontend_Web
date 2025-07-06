import { createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import Header from '@/features/header/components/Header';
import Layout from '@/components/layout/layout';
import MainPage from '@/pages/mainPage/MainPage';
import LoginPage from '@/pages/loginPage/LoginPage';
import EditProfilePage from '@/pages/userPage/EditProfilePage';
import StoragePage from '@/pages/storagePage/StoragePage';

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Header />
            <Layout>
                <Outlet />
            </Layout>
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
    routeTree: rootRoute.addChildren([mainRoute, storageRoute, loginRoute, editProfileRoute, notFoundRoute]),
});

function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;
