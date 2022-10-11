import Link from "next/link";
import React from "react";
import { FaBars, FaSearch, FaUser } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import Button from "src/components/Button";

type MobileNavItem = {
  icon: IconType;
  label: string;
} & (
  | {
      href: string;
      onClick?: never;
    }
  | {
      href?: never;
      onClick: (e: any) => void;
    }
);

const mobileNavItems: MobileNavItem[] = [
  {
    icon: FaBars,
    label: "Produkter",
    href: "/discs",
  },
  {
    icon: FaSearch,
    label: "Søk",
    href: "/search",
  },
  {
    icon: FaUser,
    label: "Bruker",
    href: "/user",
  },
];

const MobileNav = () => {
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 bg-teal-500 text-white">
      <div className="flex py-4">
        {mobileNavItems.map((item) => (
          <React.Fragment key={item.label}>
            {item.href ? (
              <Link href={item.href} passHref>
                <a className="flex-1 flex flex-col items-center gap-1">
                  <item.icon />
                  <span aria-label={item.label}>{item.label}</span>
                </a>
              </Link>
            ) : (
              <button className="flex-1 flex flex-col items-center gap-1">
                <item.icon />
                <span aria-label={item.label}>{item.label}</span>
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
