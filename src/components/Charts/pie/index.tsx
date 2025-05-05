//@ts-nocheck

import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getDevicesUsedData } from "@/services/charts.services";
import { PayOverviewChart } from "./chart";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export async function PayOverview({
  timeFrame = "monthly",
  className,
}: PropsType) {
  const data = await getDevicesUsedData(timeFrame);

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Payments Overview
        </h2>
        <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" />
      </div>

      {!data ? <p>Loading...</p> : <PayOverviewChart data={data} />}
    </div>
  );
}
