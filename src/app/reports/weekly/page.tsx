import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { WeeklyReport } from "@/components/Reports/Weekly";
import { Metadata } from "next";

/* export const metadata: Metadata = { 
  title: "Weekly Reporting Table",
  description: "This is the weekly reporting table",
}; */

const WeeklyReportTable = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb page="Report" pageName="Weekly" />

        <WeeklyReport />
      </div>
    </DefaultLayout>
  );
};

export default WeeklyReportTable;
