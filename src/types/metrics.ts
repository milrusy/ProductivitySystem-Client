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
