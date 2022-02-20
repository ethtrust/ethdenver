import React, { Fragment, useContext, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import WalletSvg from "../svg/WalletSvg";
import { useActiveWeb3React } from "../../hooks";
import { getEllipsisTxt } from "../../utils";
import { ConnectOrOpen } from "../common/ConnectOrOpenLink";

export const ConnectWalletButton = (props: any) => {
  const context = useActiveWeb3React();
  const {
    web3enabled,
    chainId,
    account,
    connector,
    connectWallet,
    deactivate,
  } = context as any;

  const disconnect = async () => {
    try {
      await deactivate();
    } catch (e) {
      console.log("ERROR", e);
    }
  };

  return (
    <div className="inset-y-0 right-0 flex items-center pr-2 space-x-4 font-medium sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      {account ? (
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex items-center max-w-xs px-4 py-2 text-white transition rounded-full bg-gradient-to-tl from-indigo-500 via-purple-500 to-pink-500 hover:bg-gray-700 shadow-homogen font-poppins">
              <span className="sr-only">Open user menu</span>

              <div className="pr-2">
                <WalletSvg className="w-5 h-5 text-white" />
              </div>

              <div className="font-sm">{getEllipsisTxt(account)}</div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 py-1 mt-2 origin-top-right bg-gray-800 rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                <div className="m-2 rounded-md hover:bg-gray-700">
                  <button
                    onClick={() => disconnect()}
                    className="block p-2 text-white "
                  >
                    Disconnect
                  </button>
                </div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : (
        <ConnectOrOpen
          onClick={() => connectWallet(true)}
          className="px-4 py-2 font-semibold transition border-2 rounded-full shadow-lg hover:border-primary hover:text-primary hover:shadow-primary/30 border-primary/80 text-primary/90 shadow-primary/10"
        >
          {" "}
          Connect wallet{" "}
        </ConnectOrOpen>
      )}
    </div>
  );
};
