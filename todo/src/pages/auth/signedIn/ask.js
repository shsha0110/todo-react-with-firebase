import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from "@/firebase/index.js";

export default function Ask() {
    const router = useRouter();
    const { data : session } = useSession();
    const [mbti, setMbti] = useState("");
    const [nickname, setNickname] = useState("");
    
    useEffect(() => {
        if(session){
            const docRef = db.collection("users").doc(session.user.email);
            
            docRef.get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    setNickname(userData.nickname);
                    setMbti(userData.mbti);
                } 
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    }, [session]);

    const submit = async (e) => {
        e.preventDefault();
        const docRef = db.collection("users").doc(session.user.email);
        
        docRef.set({
            nickname: nickname,
            mbti: mbti
        }, { merge: true })
        .then(() => {
            console.log("Document successfully updated!");
            router.push('/auth/signin'); // redirect back to home
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
