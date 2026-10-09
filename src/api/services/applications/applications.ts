import type { Application, ApplicationStatus, PriorityLevel } from "../../../data/models/Application";
import type { ApplicationPayload } from "../../../data/models/ApplicationPayload";
import type {  ApiResponse, ApplicationResponse } from "../../../responses/responses";
import axiosInstance from "../../axios_intance";

export type ApplicationFilters = {
  page?: number;
  limit?: number;
  programId?: number;
  status?: ApplicationStatus;
  priorityLevel?: PriorityLevel;
  minScore?: number;
  search?: string;
  sortBy?: "score" | "createdAt" | "yearsOfExperience" | "projectsCount";
  order?: "ASC" | "DESC";
};

export const applicationApi = {
  // Renvoie la réponse entière : on a besoin de `pagination` pour le tableau de bord
  getAll: async (filters: ApplicationFilters = {}): Promise<ApiResponse<Application>> => {
    const response = await axiosInstance.get("/applications", { params: filters });
    return response.data;
  },

  // Le détail arrive dans data[0]
  getById: async (id: number): Promise<Application> => {
    const response = await axiosInstance.get<ApiResponse<Application>>(`/applications/${id}`);
    return response.data.data[0];
  },

  create: async (payload: ApplicationPayload): Promise<ApplicationResponse> => {
    const response = await axiosInstance.post("/applications", payload);
    return response.data;
  },

  updateStatus: async (id: number, status: ApplicationStatus): Promise<{ id: number; status: ApplicationStatus }> => {
    const response = await axiosInstance.patch<ApiResponse<{ id: number; status: ApplicationStatus }>>(
      `/applications/${id}/status`,
      { status }
    );
    return response.data.data[0];
  },
};