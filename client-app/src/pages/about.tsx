import Head from "next/head";
import { NextPage } from "next";

const About: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen sm:flex-row sm:justify-evenly">
      <Head>
        <title>EthTrust wallet controller</title>
        <meta name="description" content="EthTrust wallet controller" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <h1 className="">
          EthTrust is your partner for securing your assets. Safely.
        </h1>
      </main>
    </div>
  );
};

export default About;
