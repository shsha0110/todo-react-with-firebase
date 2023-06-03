import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, signupEmail } from "@/firebase/index.js";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [idChecked, setIdChecked] = useState(false);
  const [userIdExists, setUserIdExists] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [passwordChecked, setPasswordChecked] = useState(false);
  const [signupError, setSignupError] = useState("");

  const handleIdInputChange = (e) => {
    setUserId(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setUserPassword(e.target.value);
    checkUserPassword(e.target.value);
  };

  const checkUserId = async () => {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      setUserIdExists(true);
    } else {
      setIdChecked(true);
    }
  };

  const checkUserPassword = async () => {
    if (userPassword.length >= 8) {
      setPasswordChecked(true);
    } else {
      setPasswordChecked(false);
    }
  };

  const saveUserAccount = async () => {
    if (idChecked && !userIdExists && passwordChecked) {
      try {
        const result = await signupEmail(userId, userPassword);
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { email: user.email, userId: userId });

        // Sign in the user with next-auth
        const credentials = { 
          email: userId, 
          password: userPassword, 
        };
        signIn("Credentials", credentials)
          .then(() => {
            router.push("/auth/askName");
          })
          .catch((error) => {
            console.log(error);
          });
  
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setSignupError("사용할 수 없는 아이디입니다");
        } else {
          console.error(error);
        }
      }
    } else {
      console.error(
        "이미 존재하는 아이디거나 중복확인을 하지 않은 아이디이거나 유효하지 않은 비밀번호입니다."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-lg border border-gray-300 p-4 m-4 w-1/4">
        <h2 className="text-center font-bold mb-4">Create your account</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            className={`flex-grow mr-2 p-1 ${
              userIdExists ? "border-red-500" : "border-transparent"
            } rounded`}
            placeholder="Your Email"
            onChange={handleIdInputChange}
            value={userId}
            style={{ height: "35px" }}
          />
          <button
            className="p-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500"
            onClick={checkUserId}
          >
            중복확인
          </button>
        </div>
        {idChecked && !userIdExists && (
          <div className="text-green-500 text-sm mb-4">
            사용가능한 아이디입니다!
          </div>
        )}
        {userIdExists && (
          <div className="text-red-500 text-sm mb-4">
            중복되는 아이디가 존재합니다. 다른 아이디를 시도해보세요!
          </div>
        )}
        {signupError && (
          <div className="text-red-500 text-sm mb-4">
            {signupError}
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            className={`flex-grow mr-2 p-1 ${
              passwordChecked ? "border-red-500" : "border-transparent"
            } rounded`}
            placeholder="Your Password"
            onChange={handlePasswordInputChange}
            value={userPassword}
            style={{ height: "35px" }}
          />
        </div>
        {passwordChecked && (
          <div className="text-green-500 text-sm mb-4">
            사용가능한 비밀번호입니다!
          </div>
        )}
        {!passwordChecked && (
          <div className="text-red-500 text-sm mb-4">
            비밀번호는 8자리 이상이어야 합니다!
          </div>
        )}
        <button
          className={`w-full p-1 ${
            idChecked && !userIdExists && passwordChecked
              ? "bg-blue-500"
              : "bg-blue-200"
          } text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500`}
          disabled={!idChecked || userIdExists || !passwordChecked}
          onClick={saveUserAccount}
        >
          Continue
        </button>
        <div className="flex justify-center items-center my-4">
          <hr className="w-1/4" />
          <span className="mx-2">or</span>
          <hr className="w-1/4" />
        </div>
        <button
          className="w-full p-1 bg-yellow-300 text-black border border-yellow-300 rounded hover:bg-white hover:text-yellow-300"
          onClick={() =>
            signIn("credentials", { callbackUrl: "/auth/askName" })
          }
        >
          Sign in with Kakao
        </button>
        <div>
          Don't have an account?
          <Link href="/auth/signin" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
