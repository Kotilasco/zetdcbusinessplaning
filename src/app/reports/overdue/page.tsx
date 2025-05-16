import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";


import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { SelectReport } from "@/components/Reports/IRBMQuarter";
import { YearlyReport } from "@/components/Reports/Yearly";
import DeptOverdue from "@/components/DeptOverdue";
import OverdueTable from "./OverdueTable";



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
