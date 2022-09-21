import React from "react";

import { signIn } from "next-auth/react";
import Main from "components/Main";

const LoginPage = () => {
  return (
    <Main>
      <div className="flex flex-col gap-3 py-5">
        <h1 className="text-4xl font-bold text-center mb-5">Logg inn</h1>

        <button
          type="button"
          className="bg-red-500 hover:bg-red-600 px-4 py-4 text-2xl rounded-md text-white font-semibold"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Google
        </button>

        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-4 text-2xl rounded-md text-white font-semibold"
          onClick={() => signIn("facebook")}
        >
          Facebook
        </button>
      </div>
    </Main>
  );
};

export default LoginPage;
