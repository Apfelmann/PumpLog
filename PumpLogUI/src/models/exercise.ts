export interface BodyPart {
  bodyPartGuid: string;
  name: string;
}

export interface Exercise {
  exerciseGuid: string;
  name: string;
  description?: string;
  bodyPartGuid: string;
  bodyPart?: BodyPart;
}
