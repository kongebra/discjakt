import React from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

type Props = React.PropsWithChildren<{}>;

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col pb-6 md:pb-0">
      <Navbar />

      <div className="flex-auto flex flex-col">{children}</div>

      <Footer />
    </div>
  );
};

export default Layout;
