import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from 'react';
import { auth, db } from "@/firebase/index.js";

export default function Signin() {
    const router = useRouter();
    const { data : session } = useSession();
    const [user, setUser] = useState(null);
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
                    setUser(userData);
                } else {
                    setUser({name: session.user.name, email: session.user.email, mbti: '', nickname: ''});
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
            router.push('/'); // redirect back to home
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    }

    return (
        <div className="flex justify-center h-screen">
          {session ? (
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
          ) : (
            <div className="grid m-auto text-center">
              <div className="m-4">Not signed in</div>
              <button
                className={`w-40
                          justify-self-center
                          p-1 mb-4
                        bg-blue-500 text-white
                          border border-blue-500 rounded
                        hover:bg-white hover:text-blue-500`}
                onClick={async() => await signIn()}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
    );
}
