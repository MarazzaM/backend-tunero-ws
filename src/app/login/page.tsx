"use client"
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/ui/auth/loginForm";
import SignUpForm from "@/components/ui/auth/SignUpForm";
import { useState } from "react";

export default function Login() {
  const [login, setLogin] = useState<boolean | null>(true);

  const handleSignUpSuccess = () => {
    setLogin(true);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <Link href="/">
            <Image
              src="/logo.png"
              priority
              alt="Logo"
              className="h-10 w-10 rounded-full"
              width={20}
              height={20}
            />
          </Link>
           {login ?     <h3 className="text-xl font-semibold text-black">Sign In</h3> :     <h3 className="text-xl font-semibold text-black">Register a new account!</h3>}
           {login ?      <p className="text-sm text-gray-500">
            Use your email and password to sign in
          </p> :       <p className="text-sm text-gray-500">
          Create an account using an email and password          </p>}

        </div>
        <div className="flex justify-center items-center flex-col mb-2">
        {login ? <LoginForm /> : <SignUpForm onSignUpSuccess={handleSignUpSuccess} />}

        {login ?  (
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button onClick={() => setLogin(false)} className="font-semibold text-gray-800">
            Sign up
          </button>{" "}
          for free.
        </p>
      ) : (
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={() => setLogin(true)} className="font-semibold text-gray-800">
            Sign in
          </button>{" "}
          instead.
        </p>
      )}
        </div>
      </div>
    </div>
  );
}
