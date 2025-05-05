//@ts-nocheck

"use client";

import { useState, useEffect } from "react";
import ManagersBarChart from "@/components/Charts/managers-overview/chart";
import TeamMembersBarChart from "@/components/Charts/members-overviews";
import { getManagerOverviewForDepartment } from "../actions/managers-overview";
import { getTeamOverviewForSection } from "../actions/teamMembersOverview";
import { getDepartmentsByDivisionId } from "../actions/getDepartmentsByDivisionId";

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [managersData, setManagersData] = useState<any[]>([]);
  const [teamData, setTeamData] = useState<any[]>([]); // Store team data as an array
  const [loadingTeamData, setLoadingTeamData] = useState<boolean>(false);
  const [departments, setDepartments] = useState<any[]>([]);

  // Filters with only default departmentId
  const [filters, setFilters] = useState({
    departmentId: "",
    month: "",
    week: "",
    year: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await getDepartmentsByDivisionId();
        setDepartments(departmentsData?.assignedDepartments || []);

        // Ensure the first department is set as default only when it's loaded
        if (departmentsData?.assignedDepartments?.length > 0) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            departmentId: departmentsData.assignedDepartments[0].id, // First department
          }));
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!filters.departmentId) return; // Ensure departmentId is set
    if (departments.length === 0) return; // Ensure departments are loaded before fetching

    const fetchData = async () => {
      try {
        const requestFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value), // Removes empty values
        );

        const data = await getManagerOverviewForDepartment(requestFilters);
        setManagersData(data);
      } catch (error) {
        console.error("Error fetching managers data:", error);
      }
    };

    fetchData();
  }, [filters, departments]); // Re-fetch when filters or departments change

  // Fetch managers data
  /*  useEffect(() => {
    const fetchManagersData = async () => {
      try {
        const data =
          (await getManagerOverviewForDepartment({
            departmentId: "1",
          })) || []; // Fallback to an empty array if data is null or undefined

        console.log("Fetched managers data:", data); // Debugging log
        setManagersData(data);
      } catch (err) {
        console.error("Error fetching managers data:", err);
        setManagersData([]); // Ensure managersData is reset to an empty array on error
      }
    };

    fetchManagersData();
  }, []); */

  // Fetch team data when a section is selected
  useEffect(() => {
    if (selectedSection === null) {
      return; // Do not fetch if no section is selected
    }

    const fetchTeamData = async () => {
      setLoadingTeamData(true); // Start loading indicator
      try {
        const requestFilters = Object.fromEntries(
          Object.entries({ ...filters, sectionId: selectedSection }).filter(
            ([_, value]) => value,
          ),
        );

        console.log("Request filters for team data:", requestFilters); // Debugging log

        const data = await getTeamOverviewForSection(requestFilters);
        setTeamData(data);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setTeamData([]); // Reset teamData to an empty array on error
      } finally {
        setLoadingTeamData(false); // Stop loading indicator
      }
    };

    fetchTeamData();
  }, [selectedSection]);

  console.log("Managers data:", managersData); // Debugging log
  console.log("Team data:", departments); // Debugging log
  console.log("Selected section:", selectedSection); // Debugging log

  return (
    <div>
      {/* Dropdowns */}
      <div className="mb-4 flex gap-4">
        {/* Fetch department dynamically */}
        <select
          value={filters.departmentId} // Ensures correct selection by default
          onChange={(e) =>
            setFilters({ ...filters, departmentId: e.target.value })
          }
        >
          {departments.length > 0 ? (
            departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))
          ) : (
            <option>Loading departments...</option>
          )}
        </select>

        {/* Optional filters */}
        <select
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
          onChange={(e) =>
            setFilters({ ...filters, departmentId: e.target.value })
          }
        >
          <option value="">Select Month</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, week: e.target.value || "" })
          }
        >
          <option value="">Select Week</option>
          <option value="1">Week 1</option>
          <option value="2">Week 2</option>
          <option value="3">Week 3</option>
          <option value="4">Week 4</option>
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, year: e.target.value || "" })
          }
        >
          <option value="">Select Year</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Display Managers Chart or Drill-down */}
      {!selectedSection ? (
        managersData.length > 0 ? (
          <ManagersBarChart
            data={managersData}
            onBarClick={setSelectedSection}
          />
        ) : (
          <p>Loading managers data...</p>
        )
      ) : (
        <div>
          <button
            onClick={() => setSelectedSection(null)}
            className="mb-3 bg-blue-500 px-3 py-2 text-white"
          >
            ← Back
          </button>
          <TeamMembersBarChart data={teamData || []} />
        </div>
      )}
    </div>
  );
  {
    /* <div>
      {!selectedSection ? (
        managersData.length > 0 ? (
          <ManagersBarChart
            data={managersData}
            onBarClick={setSelectedSection}
          />
        ) : (
          <p>Loading managers data...</p>
        )
      ) : (
        <div>
          <button
            onClick={() => setSelectedSection(null)}
            className="mb-3 bg-blue-500 px-3 py-2 text-white"
          >
            ← Back
          </button>
          {loadingTeamData ? (
            <p>Loading team data...</p>
          ) : (
            <TeamMembersBarChart data={teamData || []} />
          )}
        </div>
      )}
    </div>
  ); */
  }
};

export default Dashboard;
