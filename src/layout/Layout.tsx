import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

type Props = React.PropsWithChildren<{}>;

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Stack minH="100vh">
      <Navbar />

      <Box flex={"auto"}>{children}</Box>

      <Footer />
    </Stack>
  );
};

export default Layout;
