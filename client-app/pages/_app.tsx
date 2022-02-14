import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SpinnerProvider } from "../components/common/Spinner/SpinnerContext";
import { BlockchainProvider } from "../context/BlockchainContext";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BlockchainProvider>
      <SpinnerProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SpinnerProvider>
    </BlockchainProvider>
  );
}

export default MyApp;
