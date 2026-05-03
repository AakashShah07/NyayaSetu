export const ROLES = ['admin', 'department_head', 'officer'];

export const DEPARTMENTS = ['Social Welfare', 'Environment', 'Police', 'General'];

export const TASK_STATUSES = ['not_started', 'in_progress', 'completed', 'overdue', 'archived'];

export const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export const REVIEW_STATUSES = ['auto_accepted', 'needs_review', 'manually_verified'];

export const EXTRACTION_STATUSES = ['pending', 'processing', 'completed', 'failed'];

export const STATUS_COLORS = {
  not_started: 'slate',
  in_progress: 'blue',
  completed: 'green',
  overdue: 'red',
  archived: 'slate',
};

export const PRIORITY_COLORS = {
  low: 'slate',
  medium: 'blue',
  high: 'amber',
  critical: 'red',
};

export const EXTRACTION_COLORS = {
  pending: 'slate',
  processing: 'blue',
  completed: 'green',
  failed: 'red',
};

export const REVIEW_COLORS = {
  auto_accepted: 'green',
  needs_review: 'amber',
  manually_verified: 'blue',
};
