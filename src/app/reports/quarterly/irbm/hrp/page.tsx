
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SelectReport } from "@/components/Reports/IRBMQHrp";


export default function DashboardPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-[1080px] h-auto">
        <Breadcrumb page="IRBM" pageName="Quarterly" />
        
        <SelectReport type='irbm'  />
        
      </div>
    </>
  );
}
