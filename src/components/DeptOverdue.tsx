// pages/index.js
import React from 'react';
import OverdueTable from './AdminDashboard/DepartmentOverdueTasks';
const DeptOverdue = () => {
  return (
    <div>
      <h1>Department Task Overview</h1>
      <OverdueTable />
    </div>
  );
};

export default DeptOverdue;