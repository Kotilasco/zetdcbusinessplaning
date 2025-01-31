import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { SelectReport } from "@/components/Reports/SelectReport";

/* export const metadata: Metadata = {
  title: "Next.js MonthlyReports Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js MonthlyReports page for NextAdmin Dashboard Kit",
};
 */

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
