//@ts-nocheck

import { getListOfOverdueTasks } from "@/app/actions/getOverdueTaskForDepartment";
import React from "react";

// Sample Data
/* const data = [
  {
    departmentName: "Information Technology",
    sectionName: "IT Governance",
    scopeDetails: "BI development",
    workPlanId: 1,
    targetCompletionDate: "2025-02-01",
    overdueDays: 99,
    teamMembers: ["Farai Makova"],
  },
  {
    departmentName: "Information Technology",
    sectionName: "IT Governance",
    scopeDetails: "Customer Relationship Management (CRM) enhancements",
    workPlanId: 3,
    targetCompletionDate: "2024-03-31",
    overdueDays: 406,
    teamMembers: ["Nyasha Chikobvore", "Knowledge Kwaramba", "Kudakwashe Koti"],
  },
  {
    departmentName: "Information Technology",
    sectionName: "IT Governance",
    scopeDetails: "Audit compliance updates",
    workPlanId: 4,
    targetCompletionDate: "2025-01-28",
    overdueDays: 103,
    teamMembers: ["Farai Makova", "Nyasha Chikobvore", "Kudakwashe Koti"],
  },
  // Add more sections and data here as needed
]; */

// Group the data by section name
const groupDataBySection = (data) => {
  return data.reduce((acc, item) => {
    const section = item.sectionName;
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});
};

export default async function OverdueTable() {
  const data = await getListOfOverdueTasks("1");
  const groupedData = groupDataBySection(data);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 className="font-bold mb-2 ">Overdue Work Plans for department: {data[0]?.departmentName}</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={headerStyle}>Scope Details</th>
            <th style={headerStyle}>Target Completion Date</th>
            <th style={headerStyle}>Overdue Days</th>
            <th style={headerStyle}>Team Members</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((sectionName) => (
            <React.Fragment key={sectionName}>
              {/* Section Header */}
              <tr style={sectionHeaderStyle}>
                <td colSpan="4">{sectionName}</td>
              </tr>
              {/* Section Data */}
              {groupedData[sectionName].map((item, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{item.scopeDetails}</td>
                  <td style={cellStyle}>{item.targetCompletionDate}</td>
                  <td style={cellStyle}>{item.overdueDays}</td>
                  <td style={cellStyle}>{item.teamMembers.join(", ")}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Styling
const headerStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f4f4f4",
  fontWeight: "bold",
  textAlign: "left",
};

const sectionHeaderStyle = {
  backgroundColor: "#d9edf7",
  fontWeight: "bold",
  textAlign: "center",
  border: "1px solid #ddd",
  padding: "8px",
};

const cellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};
