//@ts-nocheck
"use client";

import { Card, DonutChart, List, ListItem, Legend } from "@tremor/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { gettaskedGroupedByStatusForMember } from "@/app/actions/taskgroupedbystatus";
import { useEffect, useState } from "react";
import DonutSkeleton from "./DonutSkeleton";

const Donut = ({ data }) => {
  const user = useCurrentUser();

  const [memberData, setMemberData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //console.log(data);

  const datahero = [
    {
      name: "No Work Done",
      value: 0,
    },
  ];

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await gettaskedGroupedByStatusForMember(data);
       // console.log("aaaaaaaaaaaaaa");
        //console.log(response);
       // console.log("bbbbbbbbbbbbb");
        setMemberData(response);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data]);

  console.log("jfnbdfnbfdndf");
  console.log(memberData);

  if (isLoading) {
    return (
      <Card className="border-none bg-white bg-opacity-75 sm:mx-auto sm:max-w-lg">
        <h3 className="text-tremor-default text-tremor-background-emphasis dark:text-dark-tremor-content-strong font-medium uppercase">
          Work by status
        </h3>
        <div className="text-tremor-background-emphasis mt-2 flex justify-center">
          <DonutSkeleton />
        </div>
      </Card>
    );
  }

  if (!memberData) {
    return <p>Member not found.</p>;
  }

  // Check if memberData is an array before calling transformData
  if (!Array.isArray(memberData)) {
    console.error("memberData is not an array:", memberData);
    return <p>Error: Invalid data format.</p>; // Or handle the error appropriately
  }

  return (
    <Card className="border-none bg-white bg-opacity-75 sm:mx-auto sm:max-w-lg">
      <h3 className="text-tremor-default text-tremor-background-emphasis dark:text-dark-tremor-content-strong font-medium uppercase">
        Work by status
      </h3>
      <div className="text-tremor-background-emphasis mt-2 flex justify-center">
        <DonutChart
          data={transformData(memberData)}
          className=" text-tremor-background-emphasis"
          variant="donut"
          showAnimation
          animationDuration={900}
          onValueChange={(v) => console.log(v)}
          noDataText="No work in progress"
        />
        <div className=" bg-offset-20 text-whiter bg-transparent">
          <Legend
            categories={Object.keys(datahero)}
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
            className="max-w-xs text-white"
            color="white"
          />
        </div>
      </div>
    </Card>
  );
};

export default Donut;

function transformData(dataArray) {
  console.log(dataArray);
  // Check if memberData is an array before calling transformData
  if (
    !Array.isArray(dataArray) ||
    dataArray === null ||
    dataArray === undefined
  ) {
    console.error("transformData: dataArray is not a valid array:", dataArray);
    return {};
  }
  const result = {};

  dataArray.forEach((item) => {
    const lowercaseStatus = item.status.toLowerCase();
    result[lowercaseStatus] = item.taskCount;
  });

  return Object.entries(result).map(([key, value]) => ({
    name: key,
    value: value,
  }));
}
