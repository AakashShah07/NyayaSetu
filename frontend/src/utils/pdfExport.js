import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportDepartmentReport(report) {
  const doc = new jsPDF();
  const { department, period, summary, tasks } = report;

  // Title
  doc.setFontSize(16);
  doc.text('Compliance Report', 14, 20);
  doc.setFontSize(11);
  doc.text(`Department: ${department}`, 14, 30);
  if (period.startDate || period.endDate) {
    doc.text(`Period: ${period.startDate || 'N/A'} to ${period.endDate || 'N/A'}`, 14, 37);
  }
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 44);

  // Summary
  doc.setFontSize(12);
  doc.text('Summary', 14, 56);
  doc.setFontSize(10);
  doc.text(`Total Tasks: ${summary.total}  |  Completed: ${summary.completed}  |  Overdue: ${summary.overdue}  |  Compliance: ${summary.complianceRate}%`, 14, 63);

  // Tasks table
  autoTable(doc, {
    startY: 72,
    head: [['Title', 'Status', 'Priority', 'Due Date', 'Assigned To', 'Case No.']],
    body: tasks.map((t) => [
      t.title?.substring(0, 30),
      t.status,
      t.priority,
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A',
      t.assignedTo,
      t.caseNumber,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 58, 138] },
  });

  doc.save(`compliance_report_${department.replace(/\s+/g, '_').toLowerCase()}.pdf`);
}

export function exportCaseReport(report) {
  const doc = new jsPDF();
  const { judgment, summary, directives, tasks } = report;

  doc.setFontSize(16);
  doc.text('Case Compliance Report', 14, 20);
  doc.setFontSize(11);
  doc.text(`Case: ${judgment.caseNumber}`, 14, 30);
  doc.text(`Court: ${judgment.courtName}`, 14, 37);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 44);

  // Summary
  doc.setFontSize(10);
  doc.text(`Directives: ${summary.totalDirectives} | Tasks: ${summary.totalTasks} | Completed: ${summary.completed} | Compliance: ${summary.complianceRate}%`, 14, 54);

  // Directives table
  autoTable(doc, {
    startY: 62,
    head: [['Directive', 'Deadline', 'Department', 'Status']],
    body: directives.map((d) => [
      d.text?.substring(0, 50),
      d.deadline ? new Date(d.deadline).toLocaleDateString() : 'N/A',
      d.department || 'N/A',
      d.status,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 58, 138] },
  });

  // Tasks table
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Task', 'Status', 'Priority', 'Due Date', 'Assigned To']],
    body: tasks.map((t) => [
      t.title?.substring(0, 35),
      t.status,
      t.priority,
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A',
      t.assignedTo,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 58, 138] },
  });

  doc.save(`case_report_${judgment.caseNumber.replace(/[/\s]+/g, '_')}.pdf`);
}
