"use client"

import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import { Table as BTable } from 'react-bootstrap'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { makeData, Expenditure } from './makeData'
import './index.css'

const columns: ColumnDef<Expenditure>[] = [
    {
      header: 'BUDGET COMPONENT',
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: 'budget_component',
          header: "",
          cell: info => info.getValue(),
        },
       
      ],
    },
    {
        header: 'ORIGINAL BUDGET',
            
              columns: [
                {
                  accessorKey: 'original_budget',
                  header: "$",
                  footer: props => props.column.id,
                },
               
              ],
      },
      {
        header: 'ADJUSTMENTS',
        columns: [
            {
              accessorKey: 'adjustments',
              header: "$",
              footer: props => props.column.id,
            },
           
          ],
      },
      {
        header: 'REVISED BUDGET',
        footer: props => props.column.id,
        columns: [
            {
              accessorKey: 'revised_budget',
              header: "$",
              footer: props => props.column.id,
            },
           
          ],
      },
      {
        header: 'EXPENDITURE THIS', 
        footer: props => props.column.id,
        columns: [
            {
              accessorKey: 'expenditure_this_month',
              header: "$",
              footer: props => props.column.id,
            },
           
          ],
      },
      {
        header: 'CUMULATIVE EXPENDITURE',
        footer: props => props.column.id,
        columns: [
            {
              accessorKey: 'cumulative_expenditure',
              header: "$",
              footer: props => props.column.id,
            },
           
          ],
      },
    {
      header: 'BALANCE',
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: 'balance',
          header: "$",
          footer: props => props.column.id,
        },
       
      ],
    },
  ]

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import SettingBoxes from "@/components/SettingBoxes";

/* export const metadata: Metadata = {
  title: "Next.js QuarterlyReports Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js QuarterlyReports page for NextAdmin Dashboard Kit",
}; */

const QuarterlyReports = () => {

   const [data, setData] = React.useState(makeData(10))
      const rerender = () => setData(makeData(10))
    
      const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
      })
  return (
      <div className="mx-auto w-full max-w-[1080px]">

        <div className="p-2">
                <BTable striped bordered hover responsive size="sm">
                  <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                 
                </BTable>
               
              </div>
      </div>
  );
};

export default QuarterlyReports;
