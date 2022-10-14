import React, { useEffect } from "react";

import { FaFacebook, FaGoogle } from "react-icons/fa";

import Image from "next/future/image";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

import { Button, Container, Heading, LoadingPage } from "src/components";

const LoginPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [router, status]);

  if (status === "loading" || status === "authenticated") {
    return (
      <Container>
        <LoadingPage />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex-1 flex flex-col-reverse lg:flex-row gap-4">
        <div className="flex-1 p-16">
          <Image
            src="/illustrations/security.svg"
            alt="Security"
            width={2000}
            height={2000}
            className="max-w-full h-auto"
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <Heading className="mb-4 text-center">Logg inn</Heading>

          <div className="flex flex-col gap-4">
            <Button
              color="sky"
              size="lg"
              className="gap-2"
              onClick={() => signIn("facebook", { callbackUrl: "/" })}
            >
              <FaFacebook />
              <span>Logg inn med Facebook</span>
            </Button>
            <Button
              color="danger"
              size="lg"
              className="gap-2"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <FaGoogle />
              <span>Logg inn med Google</span>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LoginPage;
