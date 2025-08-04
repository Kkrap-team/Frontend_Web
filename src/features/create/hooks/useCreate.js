import { createMyFolder, createLink } from '../api/createApi';

export default function useCreateFolder() {
    const addFolder = async (data, userId, onSuccess) => {
        try {
            console.log('data!@#!@#@!', data, userId, onSuccess);
            await createMyFolder(data, userId);
            if (onSuccess) onSuccess(); // 생성 성공 시 콜백 실행
        } catch (err) {
            console.error('폴더 create 안됨 :', err);
        }
    };

    const addLink = async (data, userId, onSuccess) => {
        try {
            await createLink(data, userId);
            if (onSuccess) onSuccess(); // 생성 성공 시 콜백 실행
        } catch (err) {
            console.error('링크 create 안됨 :', err);
        }
    };
    return { addFolder, addLink };
}
