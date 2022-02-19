import { useActiveWeb3React } from "../../../hooks";
import { ConnectOrOpen } from "../../common/ConnectOrOpenLink";

export interface NotConnectedProps {}

/*
      <h1 className="max-w-2xl text-3xl font-normal leading-tight text-white md:text-5xl">
        EthTrust provides you with safety and security for your financial
        assets.
      </h1>
      <h2 className="text-2xl mt-8">Get started by connecting your wallet.</h2>
      */
export const NotConnected = (props: NotConnectedProps) => {
  const context = useActiveWeb3React();
  const { chainId, account, connector, connectWallet, deactivate } =
    context as any;

  return (
    <div className="bg-indigo-700 rounded-xl">
      <div className="mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">
            EthTrust provides you with safety and security for your financial
            assets.
          </span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200">
          Get started by connecting your wallet.
        </p>
        <ConnectOrOpen
          onClick={connectWallet}
          className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
        >
          {" "}
          Connect wallet{" "}
        </ConnectOrOpen>
      </div>
    </div>
  );
};

export default NotConnected;
