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
    checkDuplicateHandler,
    onSubmit,
    onCancel,
}) {
    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    return (
        <div className="ProfileFormContainer">
            <div className="FormGroup">
                <label>닉네임</label>
                <div className="NicknameRow">
                    <input
                        type="text"
                        value={nickname}
                        onChange={handleNicknameChange}
                        className={`NicknameInput ${
                            isAvailable === true ? 'Success' : isAvailable === false ? 'Error' : ''
                        }`}
                    />
                    <button type="button" className="CheckBtn" onClick={checkDuplicateHandler}>
                        중복 확인
                    </button>
                </div>
                {message && (
                    <p className={isAvailable === false ? 'ErrorText' : 'SuccessText'}>{message}</p>
                )}
            </div>

            <div className="FormGroup">
                <label>이메일</label>
                <input type="text" value={email} disabled />
            </div>

            <div className="FormGroup">
                <label>소개</label>
                <textarea
                    value={bio}
                    onChange={handleBioChange}
                    placeholder="100자 이내로 작성해주세요"
                    maxLength={100}
                />
                {console.log('소개', bio)}
            </div>

            <div className="ButtonRow">
                <button className="CancelBtn" onClick={onCancel}>
                    취소
                </button>
                <button className="SaveBtn" onClick={onSubmit}>
                    저장
                </button>
            </div>
        </div>
    );
}
