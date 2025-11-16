import type { Workout } from "./types";

export const roundTo = (v: number, step = 0.5) => Math.round(v / step) * step;

export function progressWorkout(w: Workout): Workout {
  const bump = 1.025;
  const next: Workout = JSON.parse(JSON.stringify(w));
  next.id = crypto.randomUUID();

  if (w.type === "hypertrophy" || w.type === "strongmen") {
    next.exercises = w.exercises.map((ex) => {
      const updated = {
        ...ex,
        id: crypto.randomUUID(),
        achieved: new Array(ex.sets).fill(null),
      };
      if (typeof ex.weight === "number") {
        updated.weight = roundTo(ex.weight * bump, 0.5);
      }
      const allMet = (ex.achieved || []).every(
        (v) => typeof v === "number" && v >= ex.targetReps,
      );
      if (allMet) {
        updated.targetReps = ex.targetReps + 1;
      }
      return updated;
    });
  }
  return next;
}

