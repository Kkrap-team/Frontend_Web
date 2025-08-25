import { useModal } from '@/contexts/ModalContext';
import UserSearchModal from '@/features/userSearch/components/UserSearchModal';
import AccountSettingsModal from '@/features/profile/components/AccountSettingsModal';

const ModalRenderer = () => {
    const { modalName, modalProps, hideModal } = useModal();

    if (modalName === 'userSearch') {
        return <UserSearchModal {...modalProps} onClose={hideModal} />;
    }

    if (modalName === 'accountSettings') {
        return <AccountSettingsModal {...modalProps} onClose={hideModal} />;
    }

    return null;
};

export default ModalRenderer;
