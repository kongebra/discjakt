import { useQuery } from "@tanstack/react-query";

import { GiFactory, GiFrisbee } from "react-icons/gi";
import { FaBox, FaBoxOpen, FaStore } from "react-icons/fa";

import DashboardStat from "src/features/dashboard/components/DashboardStat";
import DashboardLayout from "src/layout/DashboardLayout";

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

const fetchStats = async () => {
  const response = await fetch("http://localhost:3000/api/dashboard/stats");
  return (await response.json()) as DashboardStats;
};

const DashboardPage = () => {
  const { data, isLoading } = useQuery<DashboardStats>(
    ["dashboard", "stats"],
    fetchStats
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
