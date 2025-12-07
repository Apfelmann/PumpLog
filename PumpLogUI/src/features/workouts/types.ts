export type Section = {
  id: string;
  kind: "hypertrophy" | "strongmen" | "crossfit";
  name: string;
  weight?: number;
  sets?: number;
  targetReps?: number;
  restSec?: number;
  achieved?: (number | null)[];
  supersetWithNext?: boolean;
};

export type Session = {
  id: string;
  name: string;
  category: string[]; //upper,lower,etc
  type: string[]; //Crossfit,Strongmen,Hypertropie
  durationMin: number;
  wod?: { title: string; parts: string[]; vest?: boolean };
  exercises: Section[];
};
