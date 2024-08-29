import React, {useEffect} from "react";
import './Myprofile.css'
import { useAuth } from "../AuthContext/AithContext";

function Myprofile(){
    const {userInfo} = useAuth();

    useEffect(() => {

    })

    return (
        <div className="Myprofile">
            <div>프로필 입니다.</div>
            <p>{userInfo.email}</p>
            <p>{userInfo.nickname}</p>
            <img src={userInfo.profileImage} alt="프로필 이미지" />

        </div>
    )

}

export default Myprofile;