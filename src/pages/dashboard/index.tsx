import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DashboardStat from "src/features/dashboard/components/DashboardStat";
import useBrands from "src/hooks/use-brands";
import useDiscs from "src/hooks/use-discs";
import useProducts from "src/hooks/use-products";
import useStores from "src/hooks/use-stores";
import DashboardLayout from "src/layout/DashboardLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FaBox, FaBoxOpen, FaStore } from "react-icons/fa";

import { GiFactory, GiFrisbee } from "react-icons/gi";

type DashboardStats = {
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

const DashboardPage = () => {
  const { data, isLoading } = useQuery<DashboardStats>(
    ["dashboard", "stats"],
    async () => {
      const response = await axios.get(
        "http://localhost:3000/api/dashboard/stats"
      );
      return response.data;
    }
  );

  return (
    <DashboardLayout className="bg-gray-100">
      <h1 className="text-4xl font-bold mb-3">Dashboard</h1>

      <div className="grid grid-cols-5 gap-5">
        <DashboardStat
          title="Antall discer"
          value={data?.stats.count.discs || 0}
          color="sky"
          icon={GiFrisbee}
        />
        <DashboardStat
          title="Antall merker"
          value={data?.stats.count.brands || 0}
          color="pink"
          icon={GiFactory}
        />
        <DashboardStat
          title="Antall butikker"
          value={data?.stats.count.stores || 0}
          color="amber"
          icon={FaStore}
        />
        <DashboardStat
          title="Antall produkter"
          value={data?.stats.count.products || 0}
          color="emerald"
          icon={FaBoxOpen}
        />
        <DashboardStat
          title="Ubehandlet producter"
          value={data?.stats.count.unlinkedProducts || 0}
          color="red"
          icon={FaBox}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
