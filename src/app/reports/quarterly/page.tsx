import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";


import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { SelectReport } from "@/components/Reports/SelectReport";



const QuarterlyReports = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto h-auto w-full max-w-[1080px] min-h-screen">
        <Breadcrumb page="Reports" pageName="Quarterly" />

        <SelectReport type="quarterly" />
      </div>
    </DefaultLayout>
  );
};

export default QuarterlyReports;
