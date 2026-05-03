import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleGate from './components/layout/RoleGate';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import JudgmentsListPage from './pages/JudgmentsListPage';
import JudgmentUploadPage from './pages/JudgmentUploadPage';
import JudgmentDetailPage from './pages/JudgmentDetailPage';
import TasksListPage from './pages/TasksListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import DirectivesListPage from './pages/DirectivesListPage';
import UserManagementPage from './pages/UserManagementPage';
import SystemHealthPage from './pages/SystemHealthPage';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
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
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route element={<RoleGate roles={['admin']} />}>
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/admin/health" element={<SystemHealthPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
