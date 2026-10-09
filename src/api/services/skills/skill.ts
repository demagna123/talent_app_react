import type { Skill, SkillCategory } from "../../../data/models/Skill";
import type { ApiResponse } from "../../../responses/responses";
import axiosInstance from "../../axios_intance";

export type SkillFilters = {
  category?: SkillCategory;
  search?: string;
};

export const skillApi = {
  // La liste n'est pas paginée : le backend renvoie directement toutes les compétences
  getAll: async (filters: SkillFilters = {}): Promise<Skill[]> => {
    const response = await axiosInstance.get<ApiResponse<Skill>>("/skills", {
      params: filters,
    });
    return response.data.data;
  },

  // Création d'une compétence (le backend renvoie la compétence créée dans data[0])
  create: async (payload: { name: string; category: SkillCategory }): Promise<Skill> => {
    const response = await axiosInstance.post<ApiResponse<Skill>>("/skills/create", payload);
    return response.data.data[0];
  },
};