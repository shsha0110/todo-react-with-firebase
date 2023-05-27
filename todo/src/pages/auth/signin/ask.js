// This is a simplified example and should be replaced by your actual form
import { useSession } from "next-auth/react";
import firebase from "@/firebase/index.js";
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Ask() {
    const router = useRouter();
    const { data : session } = useSession();
    const [mbti, setMbti] = useState("");
    const [nickname, setNickname] = useState("");
    
    const submit = async (e) => {
        e.preventDefault();
        const docRef = firebase.firestore().collection("users").doc(session.user.email);
        
        docRef.update({
            nickname: nickname,
            mbti: mbti
        })
        .then(() => {
            console.log("Document successfully updated!");
            router.push('/'); // redirect back to home
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    }
    
    return (
        <form onSubmit={submit}>
            <label>
                Nickname:
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} required />
            </label>
            <label>
                MBTI:
                <input type="text" value={mbti} onChange={e => setMbti(e.target.value)} required />
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
}
