export interface Session {
  sessionGuid: string;
  sessionNumber: number;
  isActive: boolean;
  sections?: Section[];
  userGuid: string;
}

export interface Section {
  sectionGuid: string;
  sessionGuid: string;
  session: Session;
  order: number;
}

export interface CrossfitSection extends Section {
  wodName: string;
  description: string;
}

export interface StrengthSet {
  reps?: number;
  weight?: number;
  order?: number;
  notes?: string;
}

export interface StrengthSection extends Section {
  exerciseName: string;
  strengthSets: StrengthSet[];
}
