import DashboardLayout from "layout/DashboardLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

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

  return (
    <DashboardLayout>
      <h1>Dashboard</h1>
    </DashboardLayout>
  );
};

export default DashboardPage;
