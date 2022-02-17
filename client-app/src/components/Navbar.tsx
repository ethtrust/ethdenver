import { Disclosure, Menu, Transition } from "@headlessui/react";
import Web3Modal from "web3modal";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import React, { Fragment, useContext, useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { ethers } from "ethers";
import { getEllipsisTxt } from "../utils";
import WalletSvg from "./svg/WalletSvg";
import { ContextType } from "react";
import { useActiveWeb3React } from "../hooks";
import { LogoOnDark } from "./svg/logo-ondark";
import { ConnectWalletButton } from "./blockchain/ConnectWalletButton";

interface Props {}

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

export const Navbar = (props: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const context = useActiveWeb3React();
  const { chainId, account, connector, connectWallet, deactivate } =
    context as any;

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (window.pageYOffset > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const disconnect = async () => {
    try {
      await deactivate();
    } catch (e) {
      console.log("ERROR", e);
    }
  };

  return (
    <Disclosure
      as="nav"
      className={clsx(
        "z-40 w-full transition-all ease-in-out duration-200 py-4",
        {
          " bg-[#1b1f2b] shadow-[#1b1f2b]/20 shadow-md py-1": scrolled,
        }
      )}
    >
      {({ open }) => (
        <>
          <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                <div className="flex items-center flex-shrink-0">
                  <Link href="/" passHref>
                    <LogoOnDark className="w-48 h-48 cursor-pointer lg:block" />
                  </Link>
                  <Link href="/" passHref>
                    <LogoOnDark className="hidden w-8 h-8 cursor-pointer lg:hidden" />
                  </Link>
                </div>
                {/* <div className="hidden sm:block sm:ml-12">
                  <div className="flex space-x-12">
                    {navigation.map((item) => {
                      return (
                        <Link key={item.name} href={item.href}>
                          <div className="px-3 py-2 font-medium border-b-2 border-transparent cursor-pointer">
                            {item.name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div> */}
              </div>
              <ConnectWalletButton />
            </div>
          </div>

          <Disclosure.Panel className="bg-gray-800 sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <>
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} passHref>
                    <div className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md cursor-pointer hover:bg-gray-700 hover:text-white">
                      {item.name}
                    </div>
                  </Link>
                ))}
              </>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
