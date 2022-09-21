import { Box, Button, Heading, Spinner } from "@chakra-ui/react";
import Main from "components/Main";
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
    return (
      <Main>
        <Box textAlign="center">
          <Spinner />
        </Box>
      </Main>
    );
  }

  if (session?.user.role !== "admin") {
    return (
      <Main>
        <Box textAlign={"center"}>
          <Heading mb={10}>You are not authrozied to view this page.</Heading>

          <Button
            type="button"
            colorScheme={"teal"}
            onClick={() => router.push("/")}
          >
            Go to homepage
          </Button>
        </Box>
      </Main>
    );
  }

  return (
    <Main>
      <h1>Dashboard</h1>
    </Main>
  );
};

export default DashboardPage;
