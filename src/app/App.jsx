import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/routes/Router';
import { ModalProvider } from '@/contexts/ModalContext';
import ModalRenderer from '@/components/common/ModalRenderer';

export default function App() {
    return (
        <ModalProvider>
            <RouterProvider router={router} />
            <ModalRenderer />
        </ModalProvider>
    );
}
