import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Button from "components/Button";
import Modal from "components/Modal";
import CreateDiscDrawer from "features/dashboard/drawers/CreateDiscDrawer";
import useDiscs from "hooks/use-discs";
import useProducts from "hooks/use-products";
import DashboardLayout from "layout/DashboardLayout";
import Image from "next/image";
import React, { useMemo } from "react";
import { useBoolean } from "usehooks-ts";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const BASE_URL = `${API_URL}/api/data`;

const fetchData = async () => {
  const resp = await fetch(BASE_URL);
  return await resp.json();
};

const DashboardDataCleaingPage = () => {
  const { discs } = useDiscs();
  const {
    mutations: { update: updateProduct },
  } = useProducts();

  const { data, isFetching } = useQuery<Product>(["data-cleaning"], fetchData);

  const matches = useMemo(() => {
    if (data) {
      const titleWords = data.title.toLowerCase().split(" ");

      return discs.filter((disc) => {
        const discNameWords = disc.name.toLowerCase().split(" ");

        return titleWords.some((word) => discNameWords.includes(word));
      });
    }

    return [];
  }, [data, discs]);

  const createModal = useBoolean();
  const selectModal = useBoolean();

  const handleNoDisc = async () => {
    if (data) {
      const copy = {
        ...data,
        isDisc: false,
      };

      await updateProduct.mutateAsync(copy);
    }
  };

  const render = () => {
    if (isFetching) {
      return <p>Loading...</p>;
    }

    if (!data) {
      return <p>No data</p>;
    }

    return (
      <div className="flex justify-center">
        <div className="flex flex-col gap-3 rounded-lg shadow w-full max-w-lg bg-slate-200 p-4">
          <Image
            className="rounded-lg mb-2"
            src={data.imageUrl}
            alt={data.title}
            layout="fixed"
            width={512 - 32}
            height={512 - 32}
          />

          <h1 className="text-2xl font-bold text-center mb-3">{data.title}</h1>

          <div className="flex justify-between">
            <Button type="button" color="success" onClick={createModal.setTrue}>
              Lag ny disc
            </Button>

            <Button type="button" color="danger" onClick={handleNoDisc}>
              Ikke en disc
            </Button>

            <Button type="button" color="warning" onClick={selectModal.setTrue}>
              Velg eksisterende
            </Button>
          </div>

          <hr className="border-slate-300" />

          <div className="flex flex-col gap-3">
            {matches.length === 0 && (
              <p className="text-center">Ingen lignende discer funnet.</p>
            )}

            {matches.map((match) => (
              <Button key={match.id}>
                {match.name} ({match.brandId})
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DashboardLayout>{render()}</DashboardLayout>

      <CreateDiscDrawer
        show={createModal.value}
        onClose={createModal.setFalse}
        defaultValues={data}
      />

      <Modal
        title="Velg disc"
        show={selectModal.value}
        onClose={selectModal.setFalse}
      >
        <p>Velg en disc</p>
      </Modal>
    </>
  );
};

export default DashboardDataCleaingPage;
