import type { Section } from "./section";

export type saveSessionRequest = {
  sessionGuid: string;
  userGuid: string;
  sections: Section[];
  title: string;
  isCompleted: boolean;
  isDeleted?: boolean;
};

export type sessionResponse = {
  title: string;
  sessionGuid: string;
  sessionNumber: number;
  isActive: boolean;
  sections: Section[];
  userGuid: string;
};
