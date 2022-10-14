import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef } from "react";
import { FaBars, FaHeart, FaSearch, FaUser } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import Button from "src/components/Button";
import SearchBar from "src/components/SearchBar";
import useUser from "src/hooks/use-user";
import MobileDrawer from "src/layout/MobileDrawer";
import { useBoolean, useOnClickOutside } from "usehooks-ts";
import MobileSearch from "./MobileSearch";

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

const MobileNav = () => {
  const router = useRouter();

  const menuDrawer = useBoolean();
  const searchBar = useBoolean();

  const searchRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(searchRef, () => {
    // TODO: sjekk om mulig å se om det er søk-knapp vi trykker på
    searchBar.setFalse();
  });

  const mobileNavItems = useMemo<MobileNavItem[]>(() => {
    const items: MobileNavItem[] = [
      {
        icon: FaBars,
        label: "Meny",
        onClick: () => {
          menuDrawer.toggle();
          if (!menuDrawer.value) {
            searchBar.setFalse();
          }
        },
      },
      {
        icon: FaSearch,
        label: "Søk",
        onClick: () => {
          searchBar.toggle();

          if (!searchBar.value) {
            menuDrawer.setFalse();
          }
        },
      },
    ];

    // if (user) {
    //   items.push({
    //     icon: FaHeart,
    //     label: "Mine favoritter",
    //     href: "/favorites",
    //   });
    // } else {
    //   items.push({
    //     icon: FaUser,
    //     label: "Logg inn",
    //     onClick: () => login(),
    //   });
    // }

    return items;
  }, [menuDrawer, searchBar]);

  useEffect(() => {
    const handleRouteChange = () => {
      menuDrawer.setFalse();
      searchBar.setFalse();
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [menuDrawer, searchBar, router.events]);

  return (
    <>
      <div className="relative">
        <SearchBar
          ref={searchRef}
          show={searchBar.value}
          onClose={searchBar.setFalse}
        />
      </div>

      <nav className="md:hidden fixed inset-x-0 bottom-0 bg-white border-t z-10">
        <div className="flex">
          {mobileNavItems.map((item) => (
            <React.Fragment key={item.label}>
              {item.href ? (
                <Link href={item.href} passHref>
                  <a className="flex-1 flex flex-col items-center gap-1  py-4">
                    <item.icon />
                    <span aria-label={item.label}>{item.label}</span>
                  </a>
                </Link>
              ) : (
                <button
                  className="flex-1 flex flex-col items-center gap-1  py-4"
                  onClick={item.onClick}
                >
                  <item.icon />
                  <span aria-label={item.label}>{item.label}</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>

      <MobileDrawer
        title="Meny"
        show={menuDrawer.value}
        onClose={menuDrawer.setFalse}
      />
    </>
  );
};

export default MobileNav;
