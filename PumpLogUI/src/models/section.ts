export interface Session {
  sessionGuid: string;
  sessionNumber: number;
  isActive: boolean;
  sections?: Section[];
  userGuid: string;
}

export interface Section {
  sectionGuid: string | undefined;
  sessionGuid: string;
  exerciseGuid: string;
  session: Session;
  order: number;
  bodyPartGuid?: string;
  supersetWithNext?: boolean;
  sectionType: "Strength" | "Crossfit" | "Hypertrophy";
}

export interface CrossfitSection extends Section {
  wodName: string;
  description: string;
}

export interface HypertrophySection extends Section {
  exerciseName: string;
  weight: number;
  reps: number;
  sets: number;
  setResults: string;
}
