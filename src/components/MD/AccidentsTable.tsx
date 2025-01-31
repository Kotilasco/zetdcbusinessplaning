import React from "react";

export default function AccidentsTable() {
  const data = [
    { type: "Electrical", fatal: 1, major: 0, minor: 0 },
    { type: "Non-Electrical", fatal: 0, major: 0, minor: 0 },
  ];

  const accidentsData = [
    {
      type: "Injuries Due To Road Traffic Accident",
      fatal: 1,
      major: 0,
      minor: 0,
    },
    { type: "Motor Vehicle Accidents", fatal: 0, major: 0, minor: 0 },
  ];

  return (
    <div className="overflow-x-auto">
      <h2 className="text-center text-lg font-semibold">
        Accidents Involving Employees
      </h2>
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400">Type</th>
            <th className="border border-gray-400">Fatal</th>
            <th className="border border-gray-400">Major</th>
            <th className="border border-gray-400">Minor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-400">{row.type}</td>
              <td className="border border-gray-400">{row.fatal}</td>
              <td className="border border-gray-400">{row.major}</td>
              <td className="border border-gray-400">{row.minor}</td>
            </tr>
          ))}
          {accidentsData.map((row, index) => (
            <tr key={index + data.length}>
              <td className="border border-gray-400">{row.type}</td>
              <td className="border border-gray-400">{row.fatal}</td>
              <td className="border border-gray-400">{row.major}</td>
              <td className="border border-gray-400">{row.minor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
