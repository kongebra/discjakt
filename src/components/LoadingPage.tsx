import Image from "next/future/image";
import React from "react";
import Container from "./Container";

const LoadingPage = () => {
  return (
    <Container className="flex flex-1 min-h-full items-center justify-center">
      <Image
        src="/illustrations/loading.svg"
        alt="Laster inn siden"
        width={512}
        height={512}
        className="max-w-full h-auto"
        priority
      />
    </Container>
  );
};

export default LoadingPage;
