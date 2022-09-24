import React from "react";

import Link from "next/link";

import { Menu as M } from "@headlessui/react";

import clsx from "clsx";

export type LinkType = {
  href: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type MenuProps = {
  button: React.ReactNode;
  links: LinkType[];
};

const Menu: React.FC<MenuProps> = ({ button, links }) => {
  return (
    <M as="div" className="relative inline-block text-left">
      <M.Button>{button}</M.Button>
      <M.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {links.map((link) => (
          <div key={link.href} className="px-1 py-1">
            <M.Item as={React.Fragment} disabled={link.disabled}>
              {({ active }) => (
                <div>
                  <Link href={link.href} passHref>
                    <a
                      className={clsx(
                        "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                        active ? "bg-gray-500 text-white" : "text-gray-900"
                      )}
                    >
                      {link.label}
                    </a>
                  </Link>
                </div>
              )}
            </M.Item>
          </div>
        ))}
      </M.Items>
    </M>
  );
};

export default Menu;
