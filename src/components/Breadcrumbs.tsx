import Link from "next/link";
import React from "react";
import Container from "./Container";

type Props = {
  items: {
    href?: string;
    label: React.ReactNode;
  }[];
};

const Breadcrumbs: React.FC<Props> = ({ items }) => {
  return (
    <div className="bg-teal-700 text-white py-2">
      <Container>
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {items.map((item, index) => (
            <li key={item.href} className="inline-flex items-center">
              {index !== 0 && <span>{" / "}</span>}
              {item.href ? (
                <Link href={item.href} passHref>
                  <a className="ml-1 text-sm font-medium text-white hover:text-gray-300 md:ml-2">
                    {item.label}
                  </a>
                </Link>
              ) : (
                <span className="ml-1 text-sm font-medium text-gray-300 md:ml-2">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
};

export default Breadcrumbs;
