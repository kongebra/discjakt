import { User } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";

export default function useUser() {
  const { status } = useSession();

  const queryClient = useQueryClient();
  const { data: user, ...rest } = useQuery<User>(
    ["user"],
    async () => {
      const resp = await fetch("http://localhost:3000/api/users/me");
      return await resp.json();
    },
    {
      enabled: status === "authenticated",
      retry: false,
    }
  );

  const login = () => {
    signIn("google");
  };

  const logout = () => {
    queryClient.setQueryData(["user"], undefined);
    signOut({ redirect: true, callbackUrl: "/" });
  };

  return {
    user,

    ...rest,

    status: status,

    login,
    logout,
  };
}
