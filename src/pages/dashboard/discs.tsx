import { Brand, Disc, Product, ProductPrice } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import Button from "components/Button";
import Drawer from "components/Drawer";
import Table from "components/Table";
import EditDiscDrawer from "features/dashboard/drawers/EditDiscDrawer";
import useDiscs from "hooks/use-discs";
import DashboardLayout from "layout/DashboardLayout";
import React, { useState } from "react";

type DiscDetails = Disc & {
  brand: Brand;
  products: Product[];
  lowestPrice: number;
};

const columnHelper = createColumnHelper<DiscDetails>();

type DefaultColumnsProps = {
  onEdit: (item: DiscDetails) => void;
  onDelete: (item: DiscDetails) => void;
};

const defaultColumns = ({ onEdit, onDelete }: DefaultColumnsProps) => {
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
    columnHelper.accessor("lowestPrice", {
      header: () => "Lavest Pris (NOK)",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: () => "Action",
      enableSorting: false,
      cell: (info) => (
        <div className="flex gap-3 items-center">
          <Button
            color="primary"
            size="sm"
            onClick={() => onEdit(info.row.original)}
          >
            Edit
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => onDelete(info.row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    }),
  ];

  return columns;
};

const DashboardDiscsPage = () => {
  const { discs, mutations } = useDiscs();

  const [selectedDisc, setSelectedDisc] = useState<DiscDetails | undefined>();
  const [deleteDisc, setDeleteDisc] = useState<DiscDetails | undefined>();

  const onEdit = (item: DiscDetails) => {
    setSelectedDisc(item);
  };
  const onDelete = (item: DiscDetails) => {
    setDeleteDisc(item);
  };

  const columns = defaultColumns({ onEdit, onDelete });

  return (
    <>
      <DashboardLayout className="bg-gray-100">
        <div>
          <Table title="Disker" data={discs} columns={columns} />
        </div>
      </DashboardLayout>

      <EditDiscDrawer
        show={selectedDisc !== undefined}
        onClose={() => setSelectedDisc(undefined)}
        defaultValues={selectedDisc}
      />

      <Drawer
        title="Delete disc"
        show={deleteDisc !== undefined}
        onClose={() => setDeleteDisc(undefined)}
      >
        <Button
          type="button"
          color="danger"
          onClick={async () => {
            if (deleteDisc) {
              await mutations.delete.mutateAsync(deleteDisc.id);
              setDeleteDisc(undefined);
            }
          }}
          isLoading={mutations.delete.isLoading}
        >
          Slett
        </Button>
      </Drawer>
    </>
  );
};

export default DashboardDiscsPage;
