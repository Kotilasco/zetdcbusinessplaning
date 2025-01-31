'use client'

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
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import SettingBoxes from "@/components/SettingBoxes";

interface TableComponentProps {
  value: any;
  year: string;
  quarter: string;
}

const TableComponent: React.FC<TableComponentProps> = ({ year, quarter }) => {
  // Table data
const [data, setData] = React.useState(makeData(10))
      const rerender = () => setData(makeData(10))
    
  
      const columns: ColumnDef<Expenditure>[] = [
        {
          header: 'STAFF CATEGORY',
          columns: [
            {
              accessorKey: 'staff_category',
              header: "",
              cell: info => info.getValue(),
              footer: 'Grand Total',
            },
           
          ],
        },
        {
            header: 'APPROVED ESTAB.',
          //  footer: 'Grand Total',
                  columns: [
                    {
                      accessorKey: 'approved_estab',
                      header: "",
                      footer: () => data.grandTotals.approved_estab,
                    },
                   
                  ],
          },
          {
            header: 'STRENGTH',
          //  footer: 'Grand Total',
            columns: [
                {
                  accessorKey: 'strength_m',
                  header: "M",
                  footer: () => data.grandTotals.strength_m,
                },
                {
                  accessorKey: 'strength_f',
                  header: "F",
                  footer: () => data.grandTotals.strength_f,
                },
              ],
          },
          {
            header: 'TOTAL',
          //  footer: 'Grand Total',
            columns: [
                {
                  accessorKey: 'total',
                  header: "",
                  footer: () => data.grandTotals.total,
                },
               
              ],
          },
          {
            header: '% IN PLACE', 
          //  footer: 'Grand Total',
            columns: [
                {
                  accessorKey: 'percentage_in_place',
                  header: "",
                  footer: () => data.grandTotals.percentage_in_place,
                },
               
              ],
          },
          {
            header: 'VARIANCE',
            columns: [
                {
                  accessorKey: 'variance',
                  header: "",
                  footer: () => data.grandTotals.variance,
                },
               
              ],
          },
        
      ]
  
  
      const table = useReactTable({
        data: data?.data,
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
          <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(footer => (
                <td key={footer.id} colSpan={footer.colSpan}>
                  {footer.isPlaceholder
                    ? null
                    : flexRender(
                        footer.column.columnDef.footer,
                        footer.getContext()
                      )}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
        </BTable>
       
      </div>
      </div>
  );
};

export default TableComponent;