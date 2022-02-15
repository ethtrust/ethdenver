import "../styles/globals.css";
import { Fragment, FunctionComponent } from "react";
import { GetStaticProps, NextComponentType, NextPageContext } from "next";

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
        <link rel="icon" type="image/png" href="favicon.png" />
        {/* iPad Retina */}
        <link
          rel="apple-touch-icon-precomposed"
          sizes="192x192"
          href="android-chrome-192x192.png.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="16x16"
          href="favicon-16x16.png"
        />
        {/* iPhone Retina */}
        <link
          rel="apple-touch-icon-precomposed"
          sizes="32x32"
          href="favicon-32x32.png"
        />
        {/* iPad 1 e 2 */}
        {/* iPhone, iPod e Android 2.2+  */}
        <link rel="manifest" href="/site.webmanifest" />
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
