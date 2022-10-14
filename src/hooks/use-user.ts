import { User } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import config from "src/config";

const BASE_URL = `${config.baseUrl}/api/users/me`;

const fetchUser = async () => {
  const resp = await fetch(BASE_URL);
  return await resp.json();
};

export default function useUser() {
  const { status } = useSession();

  const queryClient = useQueryClient();
  const { data: user, ...rest } = useQuery<User>(["user"], fetchUser, {
    enabled: status === "authenticated",
    retry: false,
  });

  const login = () => signIn();

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
