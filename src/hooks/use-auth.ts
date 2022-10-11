import { useQueryClient } from "@tanstack/react-query";
import {
  signIn,
  signOut,
  useSession,
  UseSessionOptions,
} from "next-auth/react";

export default function useAuth(
  options?: UseSessionOptions<boolean> | undefined
) {
  const session = useSession(options);

  const queryClient = useQueryClient();

  const login = () => signIn("auth0");
  const logout = () => {
    queryClient.setQueryData(["user"], undefined);
    signOut({ redirect: true, callbackUrl: "/" });
  };

  return {
    ...session,

    login,
    logout,
  };
}
