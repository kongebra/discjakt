import DashboardStat from "features/dashboard/components/DashboardStat";
import useBrands from "hooks/use-brands";
import useDiscs from "hooks/use-discs";
import useProducts from "hooks/use-products";
import useStores from "hooks/use-stores";
import DashboardLayout from "layout/DashboardLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FaBox, FaBoxOpen, FaStore } from "react-icons/fa";

import { GiFactory, GiFrisbee } from "react-icons/gi";

const DashboardPage = () => {
  const { discs } = useDiscs();
  const { brands } = useBrands();
  const { stores } = useStores();
  const { products } = useProducts();

  const unlinkedProducts = useMemo(
    () => products.filter((x) => x.discId === null && x.isDisc !== false),
    [products]
  );

  return (
    <DashboardLayout className="bg-gray-100">
      <h1 className="text-4xl font-bold mb-3">Dashboard</h1>

      <div className="grid grid-cols-5 gap-5">
        <DashboardStat
          title="Antall discer"
          value={discs.length}
          color="sky"
          icon={GiFrisbee}
        />
        <DashboardStat
          title="Antall merker"
          value={brands.length}
          color="pink"
          icon={GiFactory}
        />
        <DashboardStat
          title="Antall butikker"
          value={stores.length}
          color="amber"
          icon={FaStore}
        />
        <DashboardStat
          title="Antall produkter"
          value={products.length}
          color="emerald"
          icon={FaBoxOpen}
        />
        <DashboardStat
          title="Ubehandlet producter"
          value={unlinkedProducts.length}
          color="red"
          icon={FaBox}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
