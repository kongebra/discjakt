import Link from "next/link";
import React from "react";
import Container from "./Container";

type Props = {
  items: {
    href?: string;
    label: string;
  }[];
};

const Breadcrumbs: React.FC<Props> = ({ items }) => {
  return (
    <div className="bg-white border-b py-2">
      <Container>
        <ol className="flex flex-wrap items-center gap-2 lg:gap-4">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index !== 0 && (
                <span className="text-gray-500 mr-2 lg:mr-4">{"/"}</span>
              )}
              {item.href ? (
                <Link href={item.href} passHref>
                  <a
                    className="ml-1 text-sm font-medium hover:text-gray-800"
                    title={item.label}
                  >
                    {item.label}
                  </a>
                </Link>
              ) : (
                <span
                  className="ml-1 text-sm font-medium text-gray-500"
                  title={item.label}
                >
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
