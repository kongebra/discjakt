import { Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { FaSearch } from "react-icons/fa";
import { Button } from "src/components";
import Container from "src/components/Container";
import Input from "src/components/Input";
import SearchBar from "src/components/SearchBar";
import UserAvatar from "src/components/UserAvatar";
import { useBoolean } from "usehooks-ts";

const links = [
  // {
  //   label: "Discer",
  //   href: "/discs",
  // },
  {
    label: "Forsiden",
    href: "/",
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

const NavLink = ({ href, label }: { href: string; label: string }) => {
  return (
    <Link href={href} passHref>
      <a
        className="px-4 font-semibold text-gray-600 hover:text-black hover:underline transition"
        aria-label={label}
      >
        {label}
      </a>
    </Link>
  );
};

const DesktopNav = () => {
  const router = useRouter();

  const searchBar = useBoolean();

  return (
    <nav className="hidden md:block bg-white border-b">
      <Container className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <a
              className="text-2xl font-bold text-gray-500 hover:text-black transition"
              aria-label="DiscJakt"
            >
              DiscJakt
            </a>
          </Link>
        </div>

        <div>
          <ul className="flex items-center">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <Button
            color="white"
            onClick={() => searchBar.toggle()}
            aria-label="Vis søkebar"
          >
            <FaSearch className="text-lg text-gray-500" />
          </Button>

          <div className="flex items-center">
            <UserAvatar />
          </div>
        </div>
      </Container>

      <SearchBar show={searchBar.value} onClose={searchBar.setFalse} />
    </nav>
  );
};

export default DesktopNav;
