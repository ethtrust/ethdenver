import "../styles/globals.css";
import { Fragment, FunctionComponent } from "react";

import type { AppProps } from "next/app";
import { SpinnerProvider } from "../components/common/Spinner/SpinnerContext";
import { BlockchainWrapper } from "../components/blockchain/Wrapper";
import { useActiveWeb3React } from "../hooks";
import { useRouter } from "next/router";
import Head from "next/head";

import DefaultLayout from "../layouts/DefaultLayout";

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextComponentType<NextPageContext> & {
    Guard: FunctionComponent;
    Layout: FunctionComponent;
    Provider: FunctionComponent;
  };
}) {
  const { pathname, query, locale } = useRouter();

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || Fragment;

  // Allows for conditionally setting a layout to be hoisted per page
  const Layout = Component.Layout || DefaultLayout;

  // Allows for conditionally setting a guard to be hoisted per page
  const Guard = Component.Guard || Fragment;

  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title key="title">EthTrust</title>
      </Head>

      <BlockchainWrapper>
        <SpinnerProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SpinnerProvider>
      </BlockchainWrapper>
    </Fragment>
  );
}

export default MyApp;
