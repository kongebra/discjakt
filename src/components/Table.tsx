import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingFn,
  sortingFns,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import React, { useMemo, useState } from "react";
import Button from "./Button";
import Select from "./Select";

import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Input from "./Input";
import {
  compareItems,
  RankingInfo,
  rankItem,
} from "@tanstack/match-sorter-utils";
import { useDebounce } from "usehooks-ts";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<any>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export type PaginationData<T extends object> = {
  rows: T[];
  pageCount: number;
  totalCount: number;
};

type Props<T extends object> = {
  title: React.ReactNode;

  columns: ColumnDef<T, any>[];

  fetchData: (options: PaginationState) => Promise<PaginationData<T>>;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

const Table = <T extends object>({ title, columns, fetchData }: Props<T>) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 200);

  const fetchDataOptions = {
    pageIndex,
    pageSize,
  };

  const dataQuery = useQuery<PaginationData<T>>(
    ["table", fetchDataOptions],
    () => fetchData(fetchDataOptions),
    {
      keepPreviousData: true,
      onSettled(data, error) {
        console.log({ data });
      },
    }
  );

  const defaultData = useMemo<T[]>(() => [], []);

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  );

  const table = useReactTable<T>({
    data: dataQuery.data?.rows ?? defaultData,
    columns,
    pageCount: dataQuery.data?.pageCount ?? -1,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
    },

    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,

    globalFilterFn: fuzzyFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    manualPagination: true,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl font-bold">{title}</h2>

        <div>
          <Input
            value={globalFilter || ""}
            onChange={(e) => {
              setGlobalFilter(e.currentTarget.value);
            }}
            placeholder="Søk i tabell"
          />
        </div>
      </div>

      <table className="w-full mb-2">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-gray-300 bg-teal-500 text-white"
            >
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 text-left">
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: `flex items-center justify-between ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }`,
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {{
                        asc: <FaSortUp />,
                        desc: <FaSortDown />,
                      }[header.column.getIsSorted() as string] ?? <FaSort />}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={clsx("border-b border-gray-300 hover:bg-gray-300", {
                "bg-gray-200": index % 2 === 0,
              })}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>

      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>

        <div>
          <span>{"Side "}</span>
          <strong>
            {table.getState().pagination.pageIndex + 1}
            {" av "}
            {table.getPageCount()}
          </strong>
        </div>

        <div>
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            options={[5, 10, 20, 30, 40, 50].map((value) => ({
              value,
              label: `Vis ${value}`,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
