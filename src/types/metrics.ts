export interface Metrics {
  completedTasks: number;
  overdueTasks: number;
  avgCompletionTime: number;
  productivityScore: number;
}

export interface Trend {
  date: string;
  score: number;
}

export type DepartmentAnalytics = {
  departmentName: string;
  completedTasks: number;
  overdueTasks: number;
  productivity: number;
};

export type TaskDistribution = {
  completed: number;
  overdue: number;
  inProgress: number;
};

export type TopEmployee = {
  name: string;
  productivityScore: number;
};
