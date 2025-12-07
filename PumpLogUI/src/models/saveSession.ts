import type { Section } from "./section";

export interface saveSessionRequest {
  sessionGuid?: string;
  userGuid?: string;
  sessions?: Section[];
}

export interface sessionResponse {
  title: string;
  sessionGuid: string;
  sessionNumber: number;
  isActive: boolean;
  sections?: Section[];
  userGuid: string;
}
