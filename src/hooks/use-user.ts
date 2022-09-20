import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function useUser() {
  const { status } = useSession();

  const { data: user, ...rest } = useQuery(
    ["user"],
    async () => {
      const resp = await fetch("http://localhost:3000/api/users/me");
      return await resp.json();
    },
    {
      enabled: status === "authenticated",
    }
  );

  return {
    user,

    ...rest,

    status: status,
  };
}
