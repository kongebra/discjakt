import useBrands from "hooks/use-brands";
import useDiscs from "hooks/use-discs";
import useProducts from "hooks/use-products";
import useStores from "hooks/use-stores";
import DashboardLayout from "layout/DashboardLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

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
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
          <span className="text-gray-500 font-medium">Total Discs</span>

          <h3 className="text-4xl font-bold">{discs.totalCount}</h3>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
          <span className="text-gray-500 font-medium">Total Brands</span>

          <h3 className="text-4xl font-bold">{brands.length}</h3>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
          <span className="text-gray-500 font-medium">Total Stores</span>

          <h3 className="text-4xl font-bold">{stores.length}</h3>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
          <span className="text-gray-500 font-medium">Total Products</span>

          <h3 className="text-4xl font-bold">{products.length}</h3>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
          <span className="text-gray-500 font-medium">Unlinked Products</span>

          <h3 className="text-4xl font-bold">{unlinkedProducts.length}</h3>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
