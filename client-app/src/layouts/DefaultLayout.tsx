import React from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import Particles from "react-tsparticles";

interface Props {}

const Layout = (props: React.PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col justify-between w-full h-screen">
      <Navbar />
      <div className="container px-4 mx-auto sm:px-8 lg:px-16 xl:px-20">
        {props.children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
