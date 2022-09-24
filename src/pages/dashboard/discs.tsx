import useDiscs from "hooks/use-discs";
import DashboardLayout from "layout/DashboardLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const DashboardDiscsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  const { discs } = useDiscs();

  const render = () => {
    return <div></div>;
  };

  if (status === "loading") {
    return <div>loading...</div>;
  }

  if (session?.user.role !== "admin") {
    return (
      <div>
        <p>no authorized</p>
      </div>
    );
  }

  return <DashboardLayout>{render()}</DashboardLayout>;
};

export default DashboardDiscsPage;
