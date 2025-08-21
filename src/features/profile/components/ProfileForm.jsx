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
    const maxNickname = 10;
    const maxBio = 100;

    const nicknameLen = nickname ? nickname.length : 0;
    const bioLen = bio ? bio.length : 0;

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    return (
        <div className="ProfileFormContainer">
            <div className="ProfileFormGroup">
                <label>닉네임</label>
                <div className="ProfileNicknameRow">
                    <div className="ProfileInputWithCounter">
                        <input
                            type="text"
                            value={nickname}
                            onChange={handleNicknameChange}
                            className={`ProfileNicknameInput ${
                                isAvailable === true ? 'Success' : isAvailable === false ? 'Error' : ''
                            }`}
                            maxLength={maxNickname}
                        />
                        <span className="ProfileInputCounter">
                            {nicknameLen} / {maxNickname}
                        </span>
                    </div>
                    <button type="button" className="ProfileCheckBtn" onClick={checkDuplicateHandler}>
                        중복 확인
                    </button>
                </div>
                {message ? (
                    <p className={isAvailable === false ? 'ProfileErrorText' : 'ProfileSuccessText'}>{message}</p>
                ) : (
                    <p className="ProfileHelperText">닉네임은 10자 이내로 설정해주세요</p>
                )}
            </div>

            <div className="ProfileFormGroup">
                <label>이메일</label>
                <input type="text" value={email} disabled />
            </div>

            <div className="ProfileFormGroup">
                <label>소개</label>
                <div className="ProfileInputWithCounter">
                    <textarea
                        value={bio}
                        onChange={handleBioChange}
                        placeholder="100자 이내로 작성해주세요"
                        maxLength={maxBio}
                    />
                    <span className="ProfileInputCounter">
                        {bioLen} / {maxBio}
                    </span>
                </div>
            </div>

            <div className="ProfileButtonRow">
                <button className="ProfileCancelBtn" onClick={onCancel}>
                    취소
                </button>
                <button className="ProfileSaveBtn" onClick={onSubmit}>
                    저장
                </button>
            </div>
        </div>
    );
}
