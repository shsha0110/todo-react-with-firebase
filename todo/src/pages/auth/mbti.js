import { useState } from 'react';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase/index.js';

async function updateUserMbti(uid, mbti) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { mbti });
}

export default function Mbti() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mbti, setMbti] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (session) {
      await updateUserMbti(session.user.id, mbti);
      router.push("/auth/signin");
    }
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="grid m-auto text-center">
        <div className="m-4">What is your MBTI?</div>
        <form onSubmit={handleSubmit}>
          <input
            className="mb-4 border border-blue-500 rounded"
            type="text"
            value={mbti}
            onChange={(e) => setMbti(e.target.value)}
            required
          />
          <button
            className={`w-40
                      justify-self-center
                      p-1 mb-4
                    bg-blue-500 text-white
                      border border-blue-500 rounded
                    hover:bg-white hover:text-blue-500`}
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
