import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { db } from "@/firebase/index.js"; // the path to your firebase.js file
import { useEffect } from 'react';

export default function Signin() {
    const router = useRouter();
    const { data : session } = useSession();

    useEffect(() => {
        if(session){
            // Fetch the Firestore document
            const docRef = db.collection("users").doc(session.user.email);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                } else {
                    // If no document exists, create a new one with the user's session information
                    db.collection("users").doc(session.user.email).set({
                        name: session.user.name,
                        email: session.user.email
                    })
                    .then(() => {
                        console.log("Document successfully written!");
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
              <div className="m-4">Signed in as {session.user.name? session.user.name : session.user.email}</div>
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