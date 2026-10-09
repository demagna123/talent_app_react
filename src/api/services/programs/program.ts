import type { Program, ProgramStatus } from "../../../data/models/Program";
import type { ApiResponse } from "../../../responses/responses";
import axiosInstance from "../../axios_intance";

export type ProgramFilters = {
  page?: number;
  limit?: number;
  status?: ProgramStatus;
  search?: string;
  sortBy?: "createdAt" | "title" | "deadline" | "startDate";
  order?: "ASC" | "DESC";
};

// Ce que le formulaire de création enverra (on l'utilisera à l'étape suivante)
export type ProgramPayload = {
  title: string;
  description?: string;
  status?: ProgramStatus;
  startDate?: string;
  deadline?: string;
  maxSeats?: number;
  priorityThreshold?: number;
  reviewThreshold?: number;
  skills?: { skillId: number; weight: number; isRequired: boolean }[];
};

export const programApi = {
  // Réponse entière : on a besoin de `pagination`
  getAll: async (filters: ProgramFilters = {}): Promise<ApiResponse<Program>> => {
    const response = await axiosInstance.get("/programs", { params: filters });
    return response.data;
  },

  create: async (payload: ProgramPayload): Promise<Program> => {
    const response = await axiosInstance.post<ApiResponse<Program>>("/programs", payload);
    return response.data.data[0];
  },
};