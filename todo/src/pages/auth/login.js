import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleIdInputChange = (e) => {
    setError("");
    setUserId(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setError("");
    setUserPassword(e.target.value);
  };

  const login = async () => {
    const credentials = {
      email: userId,
      password: userPassword,
    };
    signIn("credentials", credentials)
      .then((result) => {
        if (result.error) {
          console.log("로그인 실패...ㅠㅠ");
          setError(result.error);
        } else {
          console.log("로그인 성공!");
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    }

    fetchUser();
  }, [session]);

  const handleAdminMode = () => {
    router.push("/admin/admin");
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="rounded-lg border border-gray-300 p-4 m-4 w-1/4">
          <h2 className="text-center font-bold mb-4">Welcome back!</h2>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              className={`flex-grow mr-2 p-1 ${
                error ? "border-red-500" : "border-transparent"
              } rounded`}
              placeholder="ID"
              onChange={handleIdInputChange}
              value={userId}
              style={{ height: "35px" }}
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="password"
              className={`flex-grow mr-2 p-1 ${
                error ? "border-red-500" : "border-transparent"
              } rounded`}
              placeholder="Password"
              onChange={handlePasswordInputChange}
              value={userPassword}
              style={{ height: "35px" }}
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button
            className={`w-full p-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500`}
            onClick={login}
          >
            Log in
          </button>
          <div className="flex justify-center items-center my-4">
            <hr className="w-1/4" />
            <span className="mx-2">or</span>
            <hr className="w-1/4" />
          </div>
          <button
            className="w-full p-1 bg-yellow-300 text-black border border-yellow-300 rounded hover:bg-white hover:text-yellow-300"
            onClick={() =>
              signIn("credentials", { callbackUrl: "/auth/logInSuccess" })
            }
          >
            Log in with Kakao
          </button>
          <div>
            Don't have an account?{" "}
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center h-screen">
        {user && user.mbti ? (
          <div className="grid m-auto text-center">
            <div className="m-4">
              {user.mbti + " " + user.name}님 환영합니다.
            </div>

            {user.isAdmin && (
              <button
                className={`w-40
                        justify-self-center
                        p-1 mb-4
                      bg-blue-500 text-white
                        border border-blue-500 rounded
                      hover:bg-white hover:text-blue-500`}
                onClick={handleAdminMode}
              >
                Admin Mode
              </button>
            )}
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
}
