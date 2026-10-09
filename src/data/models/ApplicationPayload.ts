import type { Availability, SkillLevel } from "./Application";
import type { EducationLevel } from "./Candidate";

export type ApplicationPayload = {
  programId: number;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    country?: string;
    city?: string;
    educationLevel: EducationLevel;
    fieldOfStudy?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  motivation: string;
  availability: Availability;
  yearsOfExperience: number;
  projectsCount: number;
  skills: { skillId: number; level: SkillLevel }[];
};