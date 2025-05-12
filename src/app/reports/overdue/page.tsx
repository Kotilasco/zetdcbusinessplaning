import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { SelectReport } from "@/components/Reports/IRBMQuarter";
import { YearlyReport } from "@/components/Reports/Yearly";
import DeptOverdue from "@/components/DeptOverdue";
import OverdueTable from "./OverdueTable";

/* export const metadata: Metadata = {
  title: "Next.js MonthlyReports Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js MonthlyReports page for NextAdmin Dashboard Kit",
};
 */

const YearlyReports = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb page="Reports" pageName="Overdue" />

        <OverdueTable />
      </div>
    </DefaultLayout>
  );
};

export default YearlyReports;
