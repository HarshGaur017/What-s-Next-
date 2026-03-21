export type Goal = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskHistoryItem = {
  id: string;
  goalId: string;
  goalTitle: string;
  taskText: string;
  durationMinutes: number;
  completedAt: string;
};

export type AppPrefs = {
  hasSeenOnboarding: boolean;
};

export type GeneratedTask = {
  text: string;
  durationMinutes: number;
  goalId: string;
  goalTitle: string;
};
