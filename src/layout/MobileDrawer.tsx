import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { FaAccusoft, FaHome, FaTimes, FaWarehouse } from "react-icons/fa";
import Heading from "../components/Heading";

type Props = React.PropsWithChildren<{
  title: React.ReactNode;

  show: boolean;
  onClose: () => void;
}>;

const MobileDrawer: React.FC<Props> = ({ title, show, onClose }) => {
  const router = useRouter();

  const menu = [
    {
      label: "Forsiden",
      href: "/",
      icon: FaHome,
    },
    {
      label: "Merker",
      href: "/brands",
    },
    {
      label: "Nettbutikker",
      href: "/stores",
    },
  ];

  return (
    <Transition appear show={show} as={Fragment}>
      <div className="relative z-20">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="ease-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="fixed inset-x-0 top-0 bottom-[76px] bg-white border-b">
            <div className="flex p-2 items-center justify-end border-b bg-gray-50">
              <button className="p-2" onClick={onClose}>
                <FaTimes className="text-2xl" />
              </button>
            </div>
            <div className="p-4">
              <Heading as="h2" className="mb-4">
                {title}
              </Heading>

              <div className="flex flex-col gap-4">
                {menu.map((item) => (
                  <Link key={item.href} href={item.href} passHref>
                    <a
                      className={clsx(
                        "rounded p-4 flex gap-2 items-center text-2xl",
                        router.asPath === item.href
                          ? "bg-gray-500 text-white font-bold"
                          : "bg-gray-100 font-semibold"
                      )}
                    >
                      {item?.icon && <item.icon />}
                      <span>{item.label}</span>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default MobileDrawer;
