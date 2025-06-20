import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/routes/Router';

export default function App() {
    return <RouterProvider router={router} />;
}
