import { useQueryClient } from "@tanstack/react-query";
import useUser from "src/hooks/use-user";
import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

const LogoutPage = () => {
  const { logout } = useUser();

  logout();

  return null;
};

export default LogoutPage;
