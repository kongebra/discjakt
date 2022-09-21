import React from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

type Props = React.PropsWithChildren<{}>;

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-auto">{children}</div>

      <Footer />
    </div>
  );
};

export default Layout;
