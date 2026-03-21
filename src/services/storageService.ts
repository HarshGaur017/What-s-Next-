import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppPrefs, Goal, TaskHistoryItem } from "../types/app";

const STORAGE_KEYS = {
  goals: "whats_next/goals",
  history: "whats_next/history",
  prefs: "whats_next/prefs",
} as const;

const readJson = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const rawValue = await AsyncStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = async <T>(key: string, value: T) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

const normalizeGoalTitle = (title: string) => title.trim().replace(/\s+/g, " ").toLowerCase();

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const storageService = {
  async getGoals() {
    const goals = await readJson<Goal[]>(STORAGE_KEYS.goals, []);
    return goals.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async addGoal(title: string) {
    const sanitizedTitle = title.trim().replace(/\s+/g, " ");
    const goals = await this.getGoals();

    const hasDuplicate = goals.some(
      (goal) => normalizeGoalTitle(goal.title) === normalizeGoalTitle(sanitizedTitle),
    );

    if (!sanitizedTitle) {
      throw new Error("Please enter a goal first.");
    }

    if (hasDuplicate) {
      throw new Error("That goal already exists.");
    }

    const now = new Date().toISOString();
    const newGoal: Goal = {
      id: createId(),
      title: sanitizedTitle,
      createdAt: now,
      updatedAt: now,
    };

    const nextGoals = [newGoal, ...goals];
    await writeJson(STORAGE_KEYS.goals, nextGoals);

    return newGoal;
  },

  async removeGoal(goalId: string) {
    const goals = await this.getGoals();
    const nextGoals = goals.filter((goal) => goal.id !== goalId);
    await writeJson(STORAGE_KEYS.goals, nextGoals);
    return nextGoals;
  },

  async getHistory() {
    const history = await readJson<TaskHistoryItem[]>(STORAGE_KEYS.history, []);
    return history.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  },

  async addHistoryItem(item: Omit<TaskHistoryItem, "id" | "completedAt">) {
    const history = await this.getHistory();
    const nextItem: TaskHistoryItem = {
      ...item,
      id: createId(),
      completedAt: new Date().toISOString(),
    };

    const nextHistory = [nextItem, ...history];
    await writeJson(STORAGE_KEYS.history, nextHistory);
    return nextItem;
  },

  async getPrefs() {
    return readJson<AppPrefs>(STORAGE_KEYS.prefs, { hasSeenOnboarding: false });
  },

  async setHasSeenOnboarding(value: boolean) {
    const prefs = await this.getPrefs();
    const nextPrefs: AppPrefs = {
      ...prefs,
      hasSeenOnboarding: value,
    };

    await writeJson(STORAGE_KEYS.prefs, nextPrefs);
    return nextPrefs;
  },
};
