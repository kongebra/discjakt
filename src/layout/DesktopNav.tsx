import Link from "next/link";
import React from "react";
import Container from "src/components/Container";
import UserAvatar from "src/components/UserAvatar";

const links = [
  {
    label: "Discer",
    href: "/discs",
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

const DesktopNav = () => {
  return (
    <nav className="hidden md:block bg-teal-500 text-white">
      <Container className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <a className="text-2xl font-bold">DiscJakt</a>
          </Link>

          <ul className="flex items-center">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} passHref>
                  <a className="p-2" aria-label={link.label}>
                    {link.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <UserAvatar />
      </Container>
    </nav>
  );
};

export default DesktopNav;
