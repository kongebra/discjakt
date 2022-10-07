import { useState } from "react";

import Link from "next/link";

import UserAvatar from "src/components/UserAvatar";

const links = [
  {
    label: "Forsiden",
    href: "/",
  },
  {
    label: "Discer",
    href: "/discs",
  },
  {
    label: "Merker",
    href: "/brands",
  },
  {
    label: "Butikker",
    href: "/stores",
  },
];

const Navbar = () => {
  const [show, setShow] = useState(false);
  const toggle = () => setShow((prev) => !prev);

  return (
    <nav className="bg-teal-500 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* LOGO + MENU */}
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <a className="text-2xl font-semibold">DiscJakt</a>
          </Link>

          <ul className="flex gap-4">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} passHref>
                  <a className="hover:text-slate-200">{label}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* LOGIN + ACCOUNT */}
        <div className="flex items-center">
          <UserAvatar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
