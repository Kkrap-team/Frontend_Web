import '@/features/profile/styles/ProfileImageEdit.css';
import { useAuthStore } from '@/stores/authStore';

export default function ProfileImageEdit({ changeImageHandler }) {
    const { user } = useAuthStore();
    const url = import.meta.env.VITE_URL;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            changeImageHandler(file);
        }
    };

    return (
        <div className="ProfileImageArea">
            <label htmlFor="ProfileImageInput">
                {/* 카카오 기본 이미지로 올때는 http가 붙어와서 http가 있으면 url을 안붙힘 */}
                <img
                    src={`${user.profile.startsWith('http') ? user.profile : `${url}${user.profile}`}?t=${Date.now()}`}
                    alt="프로필"
                    className="ProfileImage"
                />

                
            </label>
            <input
                id="ProfileImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
        </div>
    );
}
