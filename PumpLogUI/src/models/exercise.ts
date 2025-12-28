export interface BodyPart {
  bodyPartGuid: string;
  name: string;
}

export interface Exercise {
  exerciseGuid: string;
  exerciseName: string;
  name: string;
  description?: string;
  bodyPartGuid: string;
  bodyPart?: BodyPart;
}
