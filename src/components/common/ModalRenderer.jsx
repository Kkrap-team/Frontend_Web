import { useModal } from '@/contexts/ModalContext';
import FollowerPanel from '@/features/followingList/components/FollowerPanel';

const ModalRenderer = () => {
  const { modalName, modalProps, hideModal } = useModal();

  if (modalName === 'follower') {
    return <FollowerPanel {...modalProps} onClose={hideModal} />;
  }

  return null;
};

export default ModalRenderer;
