import Button from "components/Button";
import Spinner from "components/Spinner";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const links = [
  {
    text: "Home",
    href: "/",
  },
  {
    text: "Discs",
    href: "/discs",
  },
  {
    text: "Brands",
    href: "/brands",
  },
  {
    text: "Stores",
    href: "/stores",
  },
];

const Navbar = () => {
  const { status } = useSession();

  return (
    <nav className="bg-gray-300">
      <div className="h-16 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" passHref>
            <a className="text-xl font-bold mr-6">DiscJakt</a>
          </Link>

          <div className="flex items-center gap-4">
            {links.map(({ text, href }) => (
              <Link key={href} href={href} passHref>
                <a className="">{text}</a>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button>Login</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
