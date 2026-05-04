#!/usr/bin/env node
/**
 * NyayaSetu Seed Script — populates MongoDB with realistic demo data.
 *
 * Usage:
 *   cd backend/node-api
 *   node scripts/seed.js          # seed data
 *   node scripts/seed.js --reset  # drop all collections first
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Judgment = require('../src/models/Judgment');
const Directive = require('../src/models/Directive');
const Task = require('../src/models/Task');
const StatusUpdate = require('../src/models/StatusUpdate');
const Notification = require('../src/models/Notification');
const AuditLog = require('../src/models/AuditLog');
const Comment = require('../src/models/Comment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nyayasetu';

// ── Helper ──
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
function daysAgo(n) { return daysFromNow(-n); }

async function seed() {
  const reset = process.argv.includes('--reset');

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  if (reset) {
    console.log('Dropping existing data...');
    await Promise.all([
      User.deleteMany({}),
      Judgment.deleteMany({}),
      Directive.deleteMany({}),
      Task.deleteMany({}),
      StatusUpdate.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
      Comment.deleteMany({}),
    ]);
  }

  // ── 1. USERS ──
  console.log('Seeding users...');
  const users = await User.create([
    { name: 'Aarav Mehta', email: 'admin@nyayasetu.gov.in', password: 'admin12345', role: 'admin', department: 'General', phone: '9876543210' },
    { name: 'Priya Sharma', email: 'sharma@environment.gov.in', password: 'officer12345', role: 'officer', department: 'Environment', phone: '9876543211' },
    { name: 'Rajesh Kumar', email: 'kumar@socialwelfare.gov.in', password: 'officer12345', role: 'department_head', department: 'Social Welfare', phone: '9876543212' },
    { name: 'Anita Desai', email: 'desai@police.gov.in', password: 'officer12345', role: 'officer', department: 'Police', phone: '9876543213' },
    { name: 'Vikram Singh', email: 'singh@environment.gov.in', password: 'officer12345', role: 'department_head', department: 'Environment', phone: '9876543214' },
    { name: 'Neha Patel', email: 'patel@socialwelfare.gov.in', password: 'officer12345', role: 'officer', department: 'Social Welfare', phone: '9876543215' },
    { name: 'Suresh Rao', email: 'rao@police.gov.in', password: 'officer12345', role: 'department_head', department: 'Police', phone: '9876543216' },
    { name: 'Kavita Joshi', email: 'joshi@general.gov.in', password: 'officer12345', role: 'officer', department: 'General', phone: '9876543217' },
  ]);
  const [admin, sharma, rajesh, anita, vikram, neha, suresh, kavita] = users;
  console.log(`  ${users.length} users created`);

  // ── 2. JUDGMENTS ──
  console.log('Seeding judgments...');
  const judgments = await Judgment.create([
    {
      caseId: 'W.P. No. 12345/2024',
      courtName: 'High Court of Karnataka',
      judgmentDate: daysAgo(45),
      filingDate: daysAgo(120),
      judges: ['Hon. Justice A.B. Sharma', 'Hon. Justice C.D. Patel'],
      parties: { petitioner: 'Department of Environment', respondent: 'M/s Industrial Polluters Pvt. Ltd.' },
      fileUrl: '/uploads/sample_judgment.pdf',
      originalFilename: 'karnataka_hc_12345_2024.pdf',
      extractedText: 'The respondent is directed to cease all discharge of untreated effluents into the Kaveri river within 7 days. The Department of Environment shall submit a detailed remediation plan within 60 days. A sum of Rs. 5,00,000 shall be deposited as environmental compensation within 30 days.',
      extractionStatus: 'completed',
      extractedAt: daysAgo(44),
      uploadedBy: admin._id,
    },
    {
      caseId: 'W.P. No. 6789/2024',
      courtName: 'Supreme Court of India',
      judgmentDate: daysAgo(30),
      filingDate: daysAgo(90),
      judges: ['Hon. Justice P.Q. Reddy', 'Hon. Justice R.S. Iyer', 'Hon. Justice T.U. Naik'],
      parties: { petitioner: 'Anganwadi Workers Union', respondent: 'State of Karnataka' },
      fileUrl: '/uploads/sc_6789_2024.pdf',
      originalFilename: 'sc_anganwadi_6789_2024.pdf',
      extractedText: 'The State Government shall revise the honorarium of Anganwadi workers to Rs. 12,000 per month within 90 days. The Department of Social Welfare shall submit a compliance report.',
      extractionStatus: 'completed',
      extractedAt: daysAgo(29),
      uploadedBy: admin._id,
    },
    {
      caseId: 'Crl.P. No. 4521/2024',
      courtName: 'High Court of Karnataka',
      judgmentDate: daysAgo(15),
      filingDate: daysAgo(60),
      judges: ['Hon. Justice M.N. Gowda'],
      parties: { petitioner: 'State of Karnataka', respondent: 'Accused Persons (FIR No. 234/2024)' },
      fileUrl: '/uploads/hc_crlp_4521_2024.pdf',
      originalFilename: 'karnataka_hc_crlp_4521_2024.pdf',
      extractedText: 'The Superintendent of Police shall complete the investigation within 45 days. Protection shall be provided to witnesses. Weekly status reports shall be filed.',
      extractionStatus: 'completed',
      extractedAt: daysAgo(14),
      uploadedBy: admin._id,
    },
    {
      caseId: 'W.P. No. 8901/2025',
      courtName: 'High Court of Bombay',
      judgmentDate: daysAgo(10),
      filingDate: daysAgo(45),
      judges: ['Hon. Justice L.K. Deshmukh', 'Hon. Justice S.T. Kulkarni'],
      parties: { petitioner: 'Citizens Environmental Forum', respondent: 'Municipal Corporation of Pune' },
      fileUrl: '/uploads/bombay_hc_8901_2025.pdf',
      originalFilename: 'bombay_hc_8901_2025.pdf',
      extractedText: 'The Municipal Corporation shall implement solid waste management as per SWM Rules 2016. Weekly progress reports to be filed.',
      extractionStatus: 'completed',
      extractedAt: daysAgo(9),
      uploadedBy: vikram._id,
    },
    {
      caseId: 'SLP No. 1122/2025',
      courtName: 'Supreme Court of India',
      judgmentDate: daysAgo(5),
      filingDate: daysAgo(30),
      judges: ['Hon. Justice A.K. Verma', 'Hon. Justice B.C. Nair'],
      parties: { petitioner: 'National Human Rights Commission', respondent: 'State of Maharashtra' },
      fileUrl: '/uploads/sc_slp_1122_2025.pdf',
      originalFilename: 'sc_nhrc_slp_1122.pdf',
      extractionStatus: 'pending',
      uploadedBy: admin._id,
    },
    {
      caseId: 'W.P. No. 3344/2025',
      courtName: 'High Court of Delhi',
      judgmentDate: daysAgo(2),
      filingDate: daysAgo(20),
      judges: ['Hon. Justice D.E. Kapoor'],
      parties: { petitioner: 'Delhi Transport Workers Association', respondent: 'Govt. of NCT Delhi' },
      fileUrl: '/uploads/delhi_hc_3344_2025.pdf',
      originalFilename: 'delhi_hc_transport_3344.pdf',
      extractionStatus: 'processing',
      uploadedBy: kavita._id,
    },
  ]);
  console.log(`  ${judgments.length} judgments created`);

  // ── 3. DIRECTIVES ──
  console.log('Seeding directives...');
  const directives = await Directive.create([
    // From judgment 1 (Karnataka env case)
    { judgment: judgments[0]._id, directiveText: 'The respondent shall immediately cease all discharge of untreated or partially treated effluents into the Kaveri river and its tributaries.', mainAction: 'Cease discharge of untreated effluents', deadline: daysAgo(38), deadlineText: 'within 7 days', responsibleDepartment: 'Environment', responsibleEntity: 'M/s Industrial Polluters Pvt. Ltd.', confidence: 1.0, reviewStatus: 'manually_verified', sourcePage: 4 },
    { judgment: judgments[0]._id, directiveText: 'The Department of Environment shall submit a detailed environmental remediation plan for the restoration of the affected river stretch.', mainAction: 'Submit remediation plan', deadline: daysFromNow(15), deadlineText: 'within 60 days', responsibleDepartment: 'Environment', responsibleEntity: 'Department of Environment', confidence: 1.0, reviewStatus: 'manually_verified', sourcePage: 5 },
    { judgment: judgments[0]._id, directiveText: 'The respondent shall deposit a sum of Rs. 5,00,000 as interim environmental compensation with the KSPCB.', mainAction: 'Deposit environmental compensation', deadline: daysAgo(15), deadlineText: 'within 30 days', responsibleDepartment: 'Environment', confidence: 1.0, reviewStatus: 'auto_accepted', sourcePage: 5 },
    { judgment: judgments[0]._id, directiveText: 'The Commissioner of Social Welfare shall ensure affected communities are provided with alternative clean drinking water supply.', mainAction: 'Provide clean drinking water', deadline: daysFromNow(45), deadlineText: 'within 90 days', responsibleDepartment: 'Social Welfare', confidence: 1.0, reviewStatus: 'manually_verified', sourcePage: 6 },
    { judgment: judgments[0]._id, directiveText: 'The Superintendent of Police shall ensure strict compliance of this order and file a compliance report before this Court.', mainAction: 'File compliance report', deadline: daysFromNow(42), deadlineText: 'on or before 15th June 2025', responsibleDepartment: 'Police', confidence: 0.8, reviewStatus: 'auto_accepted', sourcePage: 7 },

    // From judgment 2 (Anganwadi case)
    { judgment: judgments[1]._id, directiveText: 'The State Government shall revise the honorarium of all Anganwadi workers to not less than Rs. 12,000 per month.', mainAction: 'Revise Anganwadi honorarium', deadline: daysFromNow(60), deadlineText: 'within 90 days', responsibleDepartment: 'Social Welfare', confidence: 1.0, reviewStatus: 'manually_verified', sourcePage: 12 },
    { judgment: judgments[1]._id, directiveText: 'The Department of Social Welfare shall submit a compliance report with revised pay structure within 30 days.', mainAction: 'Submit compliance report', deadline: daysFromNow(0), deadlineText: 'within 30 days', responsibleDepartment: 'Social Welfare', confidence: 0.95, reviewStatus: 'auto_accepted', sourcePage: 13 },
    { judgment: judgments[1]._id, directiveText: 'Arrears of the difference in honorarium shall be paid within 120 days from the date of this order.', mainAction: 'Pay arrears', deadline: daysFromNow(90), deadlineText: 'within 120 days', responsibleDepartment: 'Social Welfare', confidence: 0.9, reviewStatus: 'needs_review', sourcePage: 13 },

    // From judgment 3 (Criminal case)
    { judgment: judgments[2]._id, directiveText: 'The Superintendent of Police shall complete the investigation and file the final charge sheet within 45 days.', mainAction: 'File charge sheet', deadline: daysFromNow(30), deadlineText: 'within 45 days', responsibleDepartment: 'Police', confidence: 1.0, reviewStatus: 'manually_verified', sourcePage: 3 },
    { judgment: judgments[2]._id, directiveText: 'Adequate police protection shall be provided to all prosecution witnesses identified in the case.', mainAction: 'Provide witness protection', deadline: null, deadlineText: 'immediately', responsibleDepartment: 'Police', confidence: 0.85, reviewStatus: 'auto_accepted', sourcePage: 4 },
    { judgment: judgments[2]._id, directiveText: 'Weekly status reports on investigation progress shall be submitted to the Registrar of this Court.', mainAction: 'Submit weekly status reports', deadline: daysFromNow(7), deadlineText: 'weekly', responsibleDepartment: 'Police', confidence: 0.8, reviewStatus: 'auto_accepted', sourcePage: 4 },

    // From judgment 4 (Bombay waste management)
    { judgment: judgments[3]._id, directiveText: 'The Municipal Corporation shall implement source segregation of solid waste in all 15 wards within 60 days.', mainAction: 'Implement waste segregation', deadline: daysFromNow(50), deadlineText: 'within 60 days', responsibleDepartment: 'Environment', confidence: 0.95, reviewStatus: 'auto_accepted', sourcePage: 8 },
    { judgment: judgments[3]._id, directiveText: 'Weekly progress reports on solid waste management implementation shall be filed with the NGT.', mainAction: 'File weekly progress reports', deadline: daysFromNow(7), deadlineText: 'weekly', responsibleDepartment: 'Environment', confidence: 0.75, reviewStatus: 'needs_review', sourcePage: 9 },
  ]);
  console.log(`  ${directives.length} directives created`);

  // ── 4. TASKS ──
  console.log('Seeding tasks...');
  const tasks = await Task.create([
    // Env tasks
    { directive: directives[0]._id, judgment: judgments[0]._id, title: 'Enforce cessation of effluent discharge into Kaveri river', description: 'Inspect and verify that M/s Industrial Polluters has ceased all untreated effluent discharge. Issue closure notice if non-compliant.', assignedTo: sharma._id, department: 'Environment', status: 'completed', priority: 'critical', dueDate: daysAgo(38), completedAt: daysAgo(36), escalationLevel: 0 },
    { directive: directives[1]._id, judgment: judgments[0]._id, title: 'Prepare environmental remediation plan for Kaveri stretch', description: 'Engage environmental consultants, conduct water quality assessment, draft detailed remediation plan with timeline and budget.', assignedTo: vikram._id, department: 'Environment', status: 'in_progress', priority: 'high', dueDate: daysFromNow(15), escalationLevel: 0 },
    { directive: directives[2]._id, judgment: judgments[0]._id, title: 'Collect Rs. 5 lakh environmental compensation from respondent', description: 'Issue demand notice, collect deposit, submit receipt to KSPCB. Follow up if not deposited by deadline.', assignedTo: sharma._id, department: 'Environment', status: 'overdue', priority: 'high', dueDate: daysAgo(15), escalationLevel: 2, lastAlertAt: daysAgo(1) },

    // Social Welfare tasks
    { directive: directives[3]._id, judgment: judgments[0]._id, title: 'Arrange clean drinking water for affected communities near Kaveri', description: 'Identify affected villages, deploy water tankers, set up temporary purification units. Coordinate with PHE department.', assignedTo: neha._id, department: 'Social Welfare', status: 'in_progress', priority: 'high', dueDate: daysFromNow(45), escalationLevel: 0 },
    { directive: directives[5]._id, judgment: judgments[1]._id, title: 'Draft revised Anganwadi worker honorarium structure', description: 'Prepare proposal for Rs. 12,000/month minimum honorarium with grade-wise pay scale. Get Finance dept approval.', assignedTo: rajesh._id, department: 'Social Welfare', status: 'in_progress', priority: 'critical', dueDate: daysFromNow(60), escalationLevel: 0 },
    { directive: directives[6]._id, judgment: judgments[1]._id, title: 'File compliance report on Anganwadi pay revision', description: 'Submit report showing revised pay structure, implementation timeline, and budget allocation to the Supreme Court.', assignedTo: neha._id, department: 'Social Welfare', status: 'not_started', priority: 'high', dueDate: daysFromNow(0), escalationLevel: 1, lastAlertAt: daysAgo(0) },
    { directive: directives[7]._id, judgment: judgments[1]._id, title: 'Calculate and disburse Anganwadi worker arrears', description: 'Calculate differential arrears for all 14,000+ Anganwadi workers across the state. Coordinate with Treasury.', assignedTo: rajesh._id, department: 'Social Welfare', status: 'not_started', priority: 'medium', dueDate: daysFromNow(90), escalationLevel: 0 },

    // Police tasks
    { directive: directives[4]._id, judgment: judgments[0]._id, title: 'File compliance report on Kaveri pollution enforcement', description: 'Document all enforcement actions taken, site inspections conducted, and current compliance status. Submit to HC.', assignedTo: anita._id, department: 'Police', status: 'not_started', priority: 'medium', dueDate: daysFromNow(42), escalationLevel: 0 },
    { directive: directives[8]._id, judgment: judgments[2]._id, title: 'Complete investigation and file charge sheet (FIR 234/2024)', description: 'Collect remaining forensic evidence, record witness statements, compile charge sheet. Deadline: 45 days from order.', assignedTo: suresh._id, department: 'Police', status: 'in_progress', priority: 'critical', dueDate: daysFromNow(30), escalationLevel: 0 },
    { directive: directives[9]._id, judgment: judgments[2]._id, title: 'Provide police protection to prosecution witnesses', description: 'Deploy security detail for 6 identified witnesses. Maintain 24/7 guard at residences. Weekly situation report.', assignedTo: anita._id, department: 'Police', status: 'in_progress', priority: 'critical', dueDate: daysFromNow(30), escalationLevel: 0 },
    { directive: directives[10]._id, judgment: judgments[2]._id, title: 'Submit weekly investigation progress reports to HC Registrar', description: 'Prepare and submit weekly progress report detailing investigation milestones, evidence collected, and next steps.', assignedTo: suresh._id, department: 'Police', status: 'in_progress', priority: 'medium', dueDate: daysFromNow(7), escalationLevel: 0 },

    // Env tasks from Bombay case
    { directive: directives[11]._id, judgment: judgments[3]._id, title: 'Implement source segregation of solid waste in 15 wards', description: 'Roll out door-to-door waste collection with segregation bins. Train sanitation workers. Public awareness campaign.', assignedTo: vikram._id, department: 'Environment', status: 'not_started', priority: 'high', dueDate: daysFromNow(50), escalationLevel: 0 },
    { directive: directives[12]._id, judgment: judgments[3]._id, title: 'File weekly waste management progress reports to NGT', description: 'Compile ward-wise implementation data, photo evidence, challenges faced. Submit to NGT registry every Monday.', assignedTo: sharma._id, department: 'Environment', status: 'in_progress', priority: 'medium', dueDate: daysFromNow(7), escalationLevel: 0 },

    // General/Admin tasks
    { directive: directives[0]._id, judgment: judgments[0]._id, title: 'Coordinate inter-departmental meeting on Kaveri pollution case', description: 'Schedule and chair meeting with Environment, Social Welfare, and Police departments to align on compliance strategy.', assignedTo: kavita._id, department: 'General', status: 'completed', priority: 'medium', dueDate: daysAgo(30), completedAt: daysAgo(32) },
  ]);
  console.log(`  ${tasks.length} tasks created`);

  // ── 5. STATUS UPDATES ──
  console.log('Seeding status updates...');
  const statusUpdates = await StatusUpdate.create([
    // Task 0 (completed effluent cessation)
    { task: tasks[0]._id, previousStatus: 'not_started', newStatus: 'in_progress', updatedBy: sharma._id, notes: 'Site inspection scheduled for tomorrow. KSPCB team notified.', createdAt: daysAgo(40) },
    { task: tasks[0]._id, previousStatus: 'in_progress', newStatus: 'in_progress', updatedBy: sharma._id, notes: 'Inspection completed. Effluent discharge confirmed. Closure notice issued under Water Act Section 33A.', createdAt: daysAgo(39) },
    { task: tasks[0]._id, previousStatus: 'in_progress', newStatus: 'completed', updatedBy: sharma._id, notes: 'Verified discharge has ceased. Water quality samples collected — results pending. Photographic evidence attached.', createdAt: daysAgo(36) },

    // Task 1 (remediation plan in progress)
    { task: tasks[1]._id, previousStatus: 'not_started', newStatus: 'in_progress', updatedBy: vikram._id, notes: 'Environmental consultant firm M/s GreenEarth Solutions engaged. Site survey commenced.', createdAt: daysAgo(30) },
    { task: tasks[1]._id, previousStatus: 'in_progress', newStatus: 'in_progress', updatedBy: vikram._id, notes: 'Water quality report received. BOD/COD levels 3x above permissible limits. Draft plan 40% complete.', createdAt: daysAgo(15) },
    { task: tasks[1]._id, previousStatus: 'in_progress', newStatus: 'in_progress', updatedBy: vikram._id, notes: 'Draft plan reviewed by Chief Environmental Officer. Budget estimate: Rs. 2.3 crore. Final plan being prepared.', createdAt: daysAgo(5) },

    // Task 2 (overdue compensation)
    { task: tasks[2]._id, previousStatus: 'not_started', newStatus: 'in_progress', updatedBy: sharma._id, notes: 'Demand notice issued to respondent company. 30-day deadline communicated.', createdAt: daysAgo(30) },
    { task: tasks[2]._id, previousStatus: 'in_progress', newStatus: 'in_progress', updatedBy: sharma._id, notes: 'Respondent requested 15-day extension citing cash flow issues. Extension denied per court order.', createdAt: daysAgo(20) },

    // Task 4 (Anganwadi honorarium)
    { task: tasks[4]._id, previousStatus: 'not_started', newStatus: 'in_progress', updatedBy: rajesh._id, notes: 'Committee formed to draft revised pay structure. Meeting with Finance Secretary scheduled.', createdAt: daysAgo(20) },
    { task: tasks[4]._id, previousStatus: 'in_progress', newStatus: 'in_progress', updatedBy: rajesh._id, notes: 'Finance dept raised concerns about Rs. 450 crore annual impact. Preparing phased implementation proposal.', createdAt: daysAgo(10) },

    // Task 8 (investigation)
    { task: tasks[8]._id, previousStatus: 'not_started', newStatus: 'in_progress', updatedBy: suresh._id, notes: 'Investigation team of 8 officers constituted. Forensic lab reports awaited for 3 key exhibits.', createdAt: daysAgo(10) },
    { task: tasks[8]._id, previousStatus: 'in_progress', newStatus: 'in_progress', updatedBy: suresh._id, notes: '4 out of 6 witnesses recorded statements under 164 CrPC. Forensic reports for 2 exhibits received.', createdAt: daysAgo(3) },

    // Task 13 (completed meeting)
    { task: tasks[13]._id, previousStatus: 'not_started', newStatus: 'in_progress', updatedBy: kavita._id, notes: 'Meeting invite sent to all department heads. Agenda circulated.', createdAt: daysAgo(35) },
    { task: tasks[13]._id, previousStatus: 'in_progress', newStatus: 'completed', updatedBy: kavita._id, notes: 'Inter-departmental meeting held. Action items assigned. Minutes uploaded to case file.', createdAt: daysAgo(32) },
  ]);
  console.log(`  ${statusUpdates.length} status updates created`);

  // ── 6. NOTIFICATIONS ──
  console.log('Seeding notifications...');
  const notifications = await Notification.create([
    { recipient: sharma._id, type: 'deadline_reminder', title: 'OVERDUE: Environmental compensation collection', message: 'Task "Collect Rs. 5 lakh environmental compensation" is 15 days overdue. Escalation level: 2.', task: tasks[2]._id, priority: 'critical', channel: 'both', read: false, createdAt: daysAgo(1) },
    { recipient: vikram._id, type: 'deadline_reminder', title: 'Upcoming: Remediation plan due in 15 days', message: 'Your task "Prepare environmental remediation plan" is due in 15 days. Current progress: 80%.', task: tasks[1]._id, priority: 'high', channel: 'dashboard', read: false, createdAt: daysAgo(0) },
    { recipient: neha._id, type: 'deadline_reminder', title: 'DUE TODAY: Anganwadi compliance report', message: 'Task "File compliance report on Anganwadi pay revision" is due today.', task: tasks[5]._id, priority: 'critical', channel: 'both', read: false, createdAt: daysAgo(0) },
    { recipient: rajesh._id, type: 'escalation', title: 'Task escalated to you: Environmental compensation', message: 'The overdue task has been escalated to department head level. Immediate action required.', task: tasks[2]._id, priority: 'critical', channel: 'both', read: false, createdAt: daysAgo(2) },
    { recipient: admin._id, type: 'system', title: 'New judgment uploaded', message: 'W.P. No. 8901/2025 from High Court of Bombay has been uploaded and extraction completed.', judgment: judgments[3]._id, priority: 'low', channel: 'dashboard', read: true, createdAt: daysAgo(9) },
    { recipient: admin._id, type: 'system', title: 'Extraction pending: SLP No. 1122/2025', message: 'Judgment SLP No. 1122/2025 is awaiting NLP extraction. Please trigger extraction.', judgment: judgments[4]._id, priority: 'medium', channel: 'dashboard', read: false, createdAt: daysAgo(5) },
    { recipient: suresh._id, type: 'assignment', title: 'New task assigned: Complete investigation (FIR 234/2024)', message: 'You have been assigned a critical task with a 45-day deadline.', task: tasks[8]._id, priority: 'high', channel: 'both', read: true, createdAt: daysAgo(14) },
    { recipient: anita._id, type: 'assignment', title: 'New task: Witness protection deployment', message: 'Provide 24/7 police protection to 6 prosecution witnesses. High priority.', task: tasks[9]._id, priority: 'high', channel: 'both', read: true, createdAt: daysAgo(14) },
    { recipient: sharma._id, type: 'status_change', title: 'Task completed: Effluent discharge cessation', message: 'Your task has been marked as completed. Court compliance verified.', task: tasks[0]._id, priority: 'low', channel: 'dashboard', read: true, createdAt: daysAgo(36) },
    { recipient: vikram._id, type: 'deadline_reminder', title: 'Waste management reports due in 7 days', message: 'Weekly progress report for Bombay HC waste management case is due next Monday.', task: tasks[12]._id, priority: 'medium', channel: 'dashboard', read: false, createdAt: daysAgo(0) },
    { recipient: admin._id, type: 'escalation', title: '3 tasks approaching deadline this week', message: 'Weekly summary: 1 overdue, 2 due within 7 days. Review the dashboard for details.', priority: 'high', channel: 'both', read: false, createdAt: daysAgo(0) },
    { recipient: kavita._id, type: 'status_change', title: 'Meeting coordination marked complete', message: 'Inter-departmental meeting on Kaveri case has been completed successfully.', task: tasks[13]._id, priority: 'low', channel: 'dashboard', read: true, createdAt: daysAgo(32) },
  ]);
  console.log(`  ${notifications.length} notifications created`);

  // ── 7. AUDIT LOGS ──
  console.log('Seeding audit logs...');
  const auditLogs = await AuditLog.create([
    { action: 'create', entity: 'judgment', entityId: judgments[0]._id, user: admin._id, userName: 'Aarav Mehta', description: 'Aarav Mehta created a judgment: W.P. No. 12345/2024', createdAt: daysAgo(45) },
    { action: 'create', entity: 'task', entityId: tasks[0]._id, user: admin._id, userName: 'Aarav Mehta', description: 'Aarav Mehta created a task: Enforce cessation of effluent discharge', createdAt: daysAgo(44) },
    { action: 'update', entity: 'task', entityId: tasks[0]._id, user: sharma._id, userName: 'Priya Sharma', description: 'Priya Sharma updated a task: status changed to in_progress', changes: { status: 'in_progress' }, createdAt: daysAgo(40) },
    { action: 'update', entity: 'task', entityId: tasks[0]._id, user: sharma._id, userName: 'Priya Sharma', description: 'Priya Sharma updated a task: status changed to completed', changes: { status: 'completed' }, createdAt: daysAgo(36) },
    { action: 'create', entity: 'judgment', entityId: judgments[1]._id, user: admin._id, userName: 'Aarav Mehta', description: 'Aarav Mehta created a judgment: W.P. No. 6789/2024', createdAt: daysAgo(30) },
    { action: 'reassign', entity: 'task', entityId: tasks[2]._id, user: admin._id, userName: 'Aarav Mehta', description: 'Aarav Mehta reassigned task to Priya Sharma', changes: { assignedTo: sharma._id }, createdAt: daysAgo(25) },
    { action: 'create', entity: 'judgment', entityId: judgments[2]._id, user: admin._id, userName: 'Aarav Mehta', description: 'Aarav Mehta created a judgment: Crl.P. No. 4521/2024', createdAt: daysAgo(15) },
    { action: 'create', entity: 'task', entityId: tasks[8]._id, user: admin._id, userName: 'Aarav Mehta', description: 'Aarav Mehta created a task: Complete investigation FIR 234/2024', createdAt: daysAgo(14) },
    { action: 'update', entity: 'directive', entityId: directives[0]._id, user: admin._id, userName: 'Aarav Mehta', description: 'Aarav Mehta updated a directive: review status changed to manually_verified', changes: { reviewStatus: 'manually_verified' }, createdAt: daysAgo(43) },
    { action: 'create', entity: 'judgment', entityId: judgments[3]._id, user: vikram._id, userName: 'Vikram Singh', description: 'Vikram Singh created a judgment: W.P. No. 8901/2025', createdAt: daysAgo(10) },
    { action: 'create', entity: 'task', entityId: tasks[11]._id, user: admin._id, userName: 'Aarav Mehta', description: 'Aarav Mehta created a task: Implement source segregation', createdAt: daysAgo(9) },
    { action: 'update', entity: 'task', entityId: tasks[4]._id, user: rajesh._id, userName: 'Rajesh Kumar', description: 'Rajesh Kumar updated a task: started work on Anganwadi honorarium revision', changes: { status: 'in_progress' }, createdAt: daysAgo(20) },
  ]);
  console.log(`  ${auditLogs.length} audit logs created`);

  // ── 8. COMMENTS ──
  console.log('Seeding comments...');
  const comments = await Comment.create([
    { body: 'Site inspection completed. The factory has 3 discharge points — all now sealed. Photographic evidence collected for court submission.', author: sharma._id, entityType: 'task', entityId: tasks[0]._id, mentions: [], createdAt: daysAgo(37) },
    { body: 'Good work Priya. Please ensure the water quality test results are included in the compliance report.', author: admin._id, entityType: 'task', entityId: tasks[0]._id, mentions: [sharma._id], createdAt: daysAgo(36) },
    { body: 'The draft remediation plan has been shared with KSPCB for review. Expecting feedback by end of week. Budget estimate is Rs. 2.3 crore — need Finance clearance.', author: vikram._id, entityType: 'task', entityId: tasks[1]._id, mentions: [], createdAt: daysAgo(5) },
    { body: '@admin — The respondent company has not deposited the compensation amount despite multiple reminders. Recommend initiating contempt proceedings.', author: sharma._id, entityType: 'task', entityId: tasks[2]._id, mentions: [admin._id], createdAt: daysAgo(5) },
    { body: 'Agreed. Please prepare the contempt petition draft. I will review and file next week.', author: admin._id, entityType: 'task', entityId: tasks[2]._id, mentions: [sharma._id], createdAt: daysAgo(4) },
    { body: 'Water tanker deployment started in 3 villages along the affected river stretch. 200 families currently served. Purification unit installation in progress.', author: neha._id, entityType: 'task', entityId: tasks[3]._id, mentions: [], createdAt: daysAgo(10) },
    { body: 'Finance department has concerns about the annual impact of Rs. 450 crore. Proposing a phased implementation over 2 financial years.', author: rajesh._id, entityType: 'task', entityId: tasks[4]._id, mentions: [], createdAt: daysAgo(10) },
    { body: 'The Supreme Court order is clear about the 90-day timeline. We need Finance to approve at least Phase 1 covering 60% of workers immediately.', author: admin._id, entityType: 'task', entityId: tasks[4]._id, mentions: [rajesh._id], createdAt: daysAgo(8) },
    { body: 'This is a landmark environmental judgment. Documenting the full compliance journey for future reference and departmental training.', author: vikram._id, entityType: 'judgment', entityId: judgments[0]._id, mentions: [], createdAt: daysAgo(40) },
    { body: 'All 6 witnesses have been provided security detail. Situation stable. No threats reported so far.', author: anita._id, entityType: 'task', entityId: tasks[9]._id, mentions: [suresh._id], createdAt: daysAgo(7) },
    { body: 'Forensic lab reports for exhibit C and D received. DNA evidence matches. Charge sheet draft 70% complete.', author: suresh._id, entityType: 'task', entityId: tasks[8]._id, mentions: [], createdAt: daysAgo(3) },
  ]);
  console.log(`  ${comments.length} comments created`);

  // ── Summary ──
  console.log('\n========================================');
  console.log('  SEED COMPLETE');
  console.log('========================================');
  console.log(`  Users:          ${users.length}`);
  console.log(`  Judgments:      ${judgments.length}`);
  console.log(`  Directives:     ${directives.length}`);
  console.log(`  Tasks:          ${tasks.length}`);
  console.log(`  Status Updates: ${statusUpdates.length}`);
  console.log(`  Notifications:  ${notifications.length}`);
  console.log(`  Audit Logs:     ${auditLogs.length}`);
  console.log(`  Comments:       ${comments.length}`);
  console.log('========================================');
  console.log('\nLogin credentials:');
  console.log('  Admin:  admin@nyayasetu.gov.in / admin12345');
  console.log('  Officer: sharma@environment.gov.in / officer12345');
  console.log('');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
