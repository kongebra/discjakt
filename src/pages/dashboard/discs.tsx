import { Brand, Disc, Product } from "@prisma/client";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import Button from "components/Button";
import DiscItemOne from "components/DiscItemOne";
import DiscItemTwo from "components/DiscItemTwo";
import Table, { PaginationData } from "components/Table";
import useBrands from "hooks/use-brands";
import useDiscs from "hooks/use-discs";
import DashboardLayout from "layout/DashboardLayout";
import { useSession } from "next-auth/react";
import Image from "next/future/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

type DiscDetails = Disc & {
  brand: Brand;
  products: Product[];
};

const columnHelper = createColumnHelper<DiscDetails>();

const columns = [
  columnHelper.accessor("name", {
    header: () => "Navn",
    cell: ({ getValue }) => {
      return getValue();
    },
  }),
  columnHelper.accessor("brand.name", {
    header: () => "Merke",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("speed", {
    header: () => "Speed",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("glide", {
    header: () => "Glide",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("turn", {
    header: () => "Turn",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("fade", {
    header: () => "Fade",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("products", {
    header: () => "Produkter",
    cell: (info) => info.getValue().length,
  }),
];

const DashboardDiscsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  const render = () => {
    return (
      <div>
        <Table
          title="Disker"
          fetchData={async ({ pageIndex, pageSize }) => {
            const resp = await axios.get<PaginationData<DiscDetails>>(
              `http://localhost:3000/api/discs?pageIndex=${pageIndex}&pageSize=${pageSize}`
            );

            return resp.data;
          }}
          columns={columns}
        />
      </div>
    );
  };

  if (status === "loading") {
    return <div>loading...</div>;
  }

  if (session?.user.role !== "admin") {
    return (
      <div>
        <p>no authorized</p>
      </div>
    );
  }

  return <DashboardLayout className="bg-gray-100">{render()}</DashboardLayout>;
};

export default DashboardDiscsPage;
