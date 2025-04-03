import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { SelectReport } from "@/components/Reports/IRBMQuarter";
import { Monthly } from "@/components/Reports/Monthly";

/* export const metadata: Metadata = {
  title: "Next.js MonthlyReports Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js MonthlyReports page for NextAdmin Dashboard Kit",
};
 */

const MonthlyReports = () => {

  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb page="Reports" pageName="Monthly" />
        
        <Monthly />
        
      </div>
    </DefaultLayout>
  );
};

export default MonthlyReports;
