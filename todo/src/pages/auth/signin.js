import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '@/firebase/index.js';

async function createUser(uid, data) {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) { // Check if the user doesn't exist
    await setDoc(userRef, { uid, ...data }); // Only then create the user
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    createUser(user.uid, { name: user.displayName, email: user.email });
  }
});

export default function Signin() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex justify-center h-screen">
      {session ? (
        <div className="grid m-auto text-center">
          <div className="m-4">Signed in as {session.user.name}</div>
          <button
            className={`w-40
                      justify-self-center
                      p-1 mb-4
                    bg-blue-500 text-white
                      border border-blue-500 rounded
                    hover:bg-white hover:text-blue-500`}
            onClick={() => router.push("/")}
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
            onClick={() => signIn()}
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}