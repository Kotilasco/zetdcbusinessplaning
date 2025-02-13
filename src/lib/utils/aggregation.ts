//@ts-nocheck

// utils/aggregation.js
export function aggregateReports(reports) {
    const monthly = reports.reduce((acc, report) => {
      const month = new Date(report.date).getMonth();
      acc[month] = acc[month] || { target: 0, actual: 0 };
      acc[month].target += report.target;
      acc[month].actual += report.actual;
      return acc;
    }, []);
    return monthly;
  }

  export function aggregateMonthlyReports(weeklyReports) {
    const monthly = weeklyReports.reduce((acc, report) => {
      const { month } = report; // Assuming `month` is part of the report
      if (!acc[month]) {
        acc[month] = { target: 0, actual: 0, count: 0 };
      }
      acc[month].target += parseFloat(report.weeklyTarget);
      acc[month].actual += parseFloat(report.actualWorkDone);
      acc[month].count += 1;
      return acc;
    }, {});
  
    return Object.entries(monthly).map(([month, data]) => ({
      month,
      target: data.target,
      actual: data.actual,
      average: data.actual / data.count,
    }));
  }