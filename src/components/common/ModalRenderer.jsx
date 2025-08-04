import { useModal } from '@/contexts/ModalContext';
import UserSearchModal from '@/features/userSearch/componenets/UserSearchModal';

const ModalRenderer = () => {
  const { modalName, modalProps, hideModal } = useModal();

  if (modalName === 'userSearch') {
    return <UserSearchModal {...modalProps} onClose={hideModal} />;
  }

  return null;
};

export default ModalRenderer;
