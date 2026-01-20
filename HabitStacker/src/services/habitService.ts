import apiClient from "../api/client"; // The api.ts we fixed earlier with TOKEN_KEY
import { Habit, HabitResponse, HabitsListResponse } from "../types/api";

export const habitService = {
  // GET /api/habits
  getHabits: async (): Promise<HabitsListResponse> => {
    const response = await apiClient.get("/habits");
    return response.data;
  },

  // POST /api/habits
  createHabit: async (data: Partial<Habit>): Promise<HabitResponse> => {
    const response = await apiClient.post("/habits", data);
    return response.data;
  },

  // PATCH /api/habits/:id/complete
  markComplete: async (id: string): Promise<HabitResponse> => {
    const response = await apiClient.patch(`/habits/${id}/complete`);
    return response.data;
  },

  // PATCH /api/habits/:id/incomplete
  unmarkComplete: async (id: string): Promise<HabitResponse> => {
    const response = await apiClient.patch(`/habits/${id}/incomplete`);
    return response.data;
  },

  // DELETE /api/habits/:id
  deleteHabit: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/habits/${id}`);
    return response.data;
  },
};
