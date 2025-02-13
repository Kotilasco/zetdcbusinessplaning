// import { jsPDF } from "jspdf";

// export function generatePDF(reportData) {
//   const doc = new jsPDF();
//   doc.text("Performance Report", 10, 10);
//   reportData.forEach((row, index) => {
//     doc.text(`${index + 1}. ${row.activity}: ${row.actual}/${row.target}`, 10, 20 + index * 10);
//   });
//   doc.save("report.pdf");
// }