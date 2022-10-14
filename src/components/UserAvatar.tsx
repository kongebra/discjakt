import React, { Fragment } from "react";

import Image from "next/future/image";

import useUser from "src/hooks/use-user";

import Button from "./Button";
import PlaceholderUserIcon from "./PlaceholderUserIcon";
import NetworkIndicator from "./NetworkIndicator";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import clsx from "clsx";

import {
  FaHeart,
  FaRegGem,
  FaRegUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";
import useAuth from "src/hooks/use-auth";

type MenuLinkProps = {
  icon: IconType;
  href: string;
  text: React.ReactNode;
};

const MenuLink = ({ icon, href, text }: MenuLinkProps) => {
  const Icon = icon;

  return (
    <Link href={href} passHref>
      <a
        className={clsx(
          "group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-gray-100 text-gray-900"
        )}
      >
        <Icon className="mr-2" />
        {text}
      </a>
    </Link>
  );
};

const UserAvatar = () => {
  const { user, isFetching } = useUser();

  if (isFetching && !user) {
    return null;
  }

  if (!user) {
    return null;
    // return (
    //   <Link href="/login" passHref>
    //     <Button as="a">Logg inn</Button>
    //   </Link>
    // );
  }

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-12 h-12">
            {user.image ? (
              <Image
                className="max-w-full h-auto aspect-square rounded-full border-4 border-gray-300 shadow-sm"
                src={user.image ? user.image : "/placeholder.png"}
                alt={user.name || "Profil bilde"}
                width={64}
                height={64}
              />
            ) : (
              <PlaceholderUserIcon />
            )}
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
          <Menu.Items className="absolute right-0 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                <MenuLink
                  href="/account"
                  icon={FaRegUserCircle}
                  text="Min Side"
                />
              </Menu.Item>
              <Menu.Item>
                <MenuLink
                  href="/account/favorites"
                  icon={FaHeart}
                  text="Mine favoritter"
                />
              </Menu.Item>
            </div>
            {user.role.toLowerCase() === "admin" && (
              <div className="px-1 py-1">
                <Menu.Item>
                  <MenuLink
                    href="/dashboard"
                    icon={FaRegGem}
                    text="Dashboard"
                  />
                </Menu.Item>
              </div>
            )}
            <div className="px-1 py-1">
              <Menu.Item>
                <MenuLink href="/logout" icon={FaSignOutAlt} text="Logg ut" />
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>

        <NetworkIndicator status="online" />
      </Menu>
    </div>
  );
};

export default UserAvatar;
