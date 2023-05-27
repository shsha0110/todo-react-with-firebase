import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from 'react';
import { auth, db } from "@/firebase/index.js";

export default function Signin() {
    const router = useRouter();
    const { data : session } = useSession();
    const [user, setUser] = useState(null); // Add this line at the top of your component

    useEffect(() => {
      if(session){
          const docRef = db.collection("users").doc(session.user.email);
          
          docRef.get().then((doc) => {
              if (doc.exists) {
                  setUser(doc.data());
                  console.log("Document data:", doc.data());

                  if(userDoc.mbti === "") {
                    router.push('/auth/signin/ask'); // if mbti is empty, redirect to ask
                  }

              } else {
                  db.collection("users").doc(session.user.email).set({
                      name: session.user.name,
                      email: session.user.email,
                      mbti: '', // initially empty
                      nickname: '' // initially empty
                  })
                  .then(() => {
                      console.log("Document successfully written!");
                      router.push('/auth/signin/ask'); // redirect to the page to ask for mbti and nickname
                  })
                  .catch((error) => {
                      console.error("Error writing document: ", error);
                  });
              }
          }).catch((error) => {
              console.log("Error getting document:", error);
          });
      }
    }, [session]);
  
    return (
        <div className="flex justify-center h-screen">
          {session ? (
            <div className="grid m-auto text-center">
              <div className="m-4">Signed in as {user.mbti} {user.nickname}</div>
              <button
                className={`w-40
                          justify-self-center
                          p-1 mb-4
                        bg-blue-500 text-white
                          border border-blue-500 rounded
                        hover:bg-white hover:text-blue-500`}
                onClick={ () => router.push("/")}
              >
                Go to Home
              </button>
              <button
                className={`w-40
                          justify-self-center
                          p-1 mb-4
                        text-blue-500
                          border border-blue-500 rounded
                        hover:bg-white hover:text-blue-500`}
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </div>
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