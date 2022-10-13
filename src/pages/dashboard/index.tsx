import { useQuery } from "@tanstack/react-query";

import { GiFactory, GiFrisbee } from "react-icons/gi";
import { FaBox, FaBoxOpen, FaStore } from "react-icons/fa";

import DashboardStat from "src/features/dashboard/components/DashboardStat";
import DashboardLayout from "src/layout/DashboardLayout";
import { GetStaticProps, NextPage } from "next";
import { prisma } from "src/lib/prisma";

type Props = {
  stats: {
    count: {
      discs: number;
      brands: number;
      stores: number;
      products: number;
      unlinkedProducts: number;
    };
  };
};

const DashboardPage: NextPage<Props> = ({ stats }) => {
  return (
    <DashboardLayout className="bg-gray-100">
      <h1 className="text-4xl font-bold mb-3">Dashboard</h1>

      <div className="grid grid-cols-5 gap-5">
        <DashboardStat
          title="Antall discer"
          value={stats.count.discs || 0}
          color="sky"
          icon={GiFrisbee}
        />
        <DashboardStat
          title="Antall merker"
          value={stats.count.brands || 0}
          color="pink"
          icon={GiFactory}
        />
        <DashboardStat
          title="Antall butikker"
          value={stats.count.stores || 0}
          color="amber"
          icon={FaStore}
        />
        <DashboardStat
          title="Antall produkter"
          value={stats.count.products || 0}
          color="emerald"
          icon={FaBoxOpen}
        />
        <DashboardStat
          title="Ubehandlet producter"
          value={stats.count.unlinkedProducts || 0}
          color="red"
          icon={FaBox}
        />
      </div>
    </DashboardLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const discCount = await prisma.disc.count();
  const brandCount = await prisma.brand.count();
  const storeCount = await prisma.brand.count();
  const productCount = await prisma.product.count();
  const unlinkedProductCount = await prisma.product.count({
    where: {
      AND: [
        {
          discId: null,
        },
        {
          isDisc: null,
        },
      ],
    },
  });

  return {
    props: {
      stats: {
        count: {
          discs: discCount,
          brands: brandCount,
          stores: storeCount,
          products: productCount,
          unlinkedProducts: unlinkedProductCount,
        },
      },
    },
    revalidate: 60 * 5,
  };
};

export default DashboardPage;
