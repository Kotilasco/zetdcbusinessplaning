import React from "react";

function WeeklyReportForm() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Activity</label>
        <input type="text" className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Weekly Target</label>
        <input type="number" className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Actual Work Done</label>
        <input type="number" className="w-full p-2 border rounded" />
      </div>
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
}

export default WeeklyReportForm;