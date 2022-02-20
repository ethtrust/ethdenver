import React from "react";
import clsx from "clsx";
import OpenApp from "react-open-app";
import { useActiveWeb3React } from "../../hooks";

export interface IConnectOrOpen {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

export const ConnectOrOpen = ({
  onClick,
  className,
  children,
}: IConnectOrOpen) => {
  const context = useActiveWeb3React();
  const { web3enabled } = context as any;
  return web3enabled ? (
    <button onClick={onClick} className={className}>
      Connect Wallet
    </button>
  ) : (
    <OpenApp
      href="https://metamask.app.link/dapp/demo.ethtrust.net"
      className={className}
    >
      {children}
    </OpenApp>
  );
};

export default ConnectOrOpen;
