import React from 'react';
import '@/features/profile/styles/ProfileForm.css';

export default function ProfileForm({
    nickname,
    setNickname,
    email,
    bio,
    setBio,
    setIsAvailable,
    isAvailable,
    message,
    onCheckDuplicate,
    onSubmit,
    onCancel,
}) {
    return (
        <div className="profile-form-container">
            <div className="form-group">
                <label>닉네임</label>
                <div className="nickname-row">
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                        }}
                        className={`nickname-input ${
                            isAvailable === true ? 'success' : isAvailable === false ? 'error' : ''
                        }`}
                    />
                    <button type="button" className="check-btn" onClick={onCheckDuplicate}>
                        중복 확인
                    </button>
                </div>
                {message && <p className={isAvailable === false ? 'error-text' : 'success-text'}>{message}</p>}
            </div>

            <div className="form-group">
                <label>이메일</label>
                <input type="text" value={email} disabled />
            </div>

            <div className="form-group">
                <label>소개</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="100자 이내로 작성해주세요"
                    maxLength={100}
                />
                {console.log('소개', bio)}
            </div>

            <div className="button-row">
                <button className="cancel-btn" onClick={onCancel}>
                    취소
                </button>
                <button className="save-btn" onClick={onSubmit}>
                    저장
                </button>
            </div>
        </div>
    );
}
