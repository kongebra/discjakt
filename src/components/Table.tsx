import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import React, { useState } from "react";
import Button from "./Button";
import Select from "./Select";

import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Input from "./Input";
import { useDebounce } from "usehooks-ts";
import { rankItem } from "@tanstack/match-sorter-utils";

type Props<T extends object> = {
  title: React.ReactNode;

  data: T[];
  columns: ColumnDef<T, any>[];
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

const Table = <T extends object>({ title, data, columns }: Props<T>) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const delayedGlobalFilter = useDebounce(globalFilter, 200);

  const table = useReactTable<T>({
    data,
    columns,

    state: {
      globalFilter: delayedGlobalFilter,
    },

    onGlobalFilterChange: setGlobalFilter,

    globalFilterFn: fuzzyFilter,

    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function renderSortIcon({
    column: { getCanSort, getIsSorted },
  }: Header<T, unknown>): React.ReactNode {
    if (getCanSort()) {
      switch (getIsSorted()) {
        case "asc":
          return <FaSortUp />;
        case "desc":
          return <FaSortDown />;
        case false:
        default:
          return <FaSort />;
      }
    }

    return null;
  }

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

                      {renderSortIcon(header)}
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
