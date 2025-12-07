import type { Section } from "../types";
import { SetChip } from "./SetChip";

type Props = {
  exercise: Section;
  onOpenReps: (
    exId: string,
    setIdx: number,
    target: number,
    current: number | null
  ) => void;
};

export function ExerciseRow({ exercise, onOpenReps }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="font-semibold text-white">{exercise.name}</div>
          <div className="text-sm text-white/70">
            {typeof exercise.weight === "number"
              ? `${exercise.weight} kg`
              : "Körpergewicht"}
            {" · Ziel "}
            {exercise.targetReps} Wiederholungen
          </div>
        </div>
        {exercise.restSec && (
          <span className="text-xs text-white/60">
            {exercise.restSec}s Pause
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: exercise.sets }).map((_, idx) => (
          <SetChip
            key={idx}
            index={idx}
            achieved={exercise.achieved?.[idx] ?? null}
            target={exercise.targetReps}
            onClick={() =>
              onOpenReps(
                exercise.id,
                idx,
                exercise.targetReps,
                exercise.achieved?.[idx] ?? null
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
