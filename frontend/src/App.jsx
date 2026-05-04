import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleGate from './components/layout/RoleGate';
import AppLayout from './components/layout/AppLayout';
import Spinner from './components/ui/Spinner';

// Eagerly loaded (login is first screen)
import LoginPage from './pages/LoginPage';

// Lazy-loaded pages (code-split per route)
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const JudgmentsListPage = lazy(() => import('./pages/JudgmentsListPage'));
const JudgmentUploadPage = lazy(() => import('./pages/JudgmentUploadPage'));
const JudgmentDetailPage = lazy(() => import('./pages/JudgmentDetailPage'));
const TasksListPage = lazy(() => import('./pages/TasksListPage'));
const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage'));
const DirectivesListPage = lazy(() => import('./pages/DirectivesListPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'));
const SystemHealthPage = lazy(() => import('./pages/SystemHealthPage'));
const AuditLogPage = lazy(() => import('./pages/AuditLogPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/judgments" element={<JudgmentsListPage />} />
            <Route path="/judgments/upload" element={<JudgmentUploadPage />} />
            <Route path="/judgments/:id" element={<JudgmentDetailPage />} />
            <Route path="/tasks" element={<TasksListPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="/directives" element={<DirectivesListPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route element={<RoleGate roles={['admin']} />}>
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/admin/health" element={<SystemHealthPage />} />
              <Route path="/admin/audit-log" element={<AuditLogPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
