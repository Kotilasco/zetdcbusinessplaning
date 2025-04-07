//@ts-ignore
//@ts-nocheck

export function processTaskData(data) {

    //console.log(data);
    const currentDate = new Date();
  
    let overdueCount = 0;
    const statusCounts = {};
    let totalExpenditure = 0;
  
    data?.forEach(task => {
      task.scopes.forEach(scope => {
        const targetDate = new Date(scope.targetCompletionDate);

      
  
        // 1. Overdue Tasks Count
        if (
          targetDate < currentDate &&
          scope.status !== "CANCELLED" &&
          scope.status !== "COMPLETED"
        ) {
          overdueCount++;
        }
  
        // 2. Count by Status
        statusCounts[scope.status] = (statusCounts[scope.status] || 0) + 1;
  
        // 3. Total Actual Expenditure
        totalExpenditure += task.actualExpenditure;
      });
    });
  
    return { overdueCount, statusCounts, totalExpenditure };
  }
  