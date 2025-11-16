import type { Exercise } from "../types";
import { ExerciseRow } from "./ExerciseRow";

type Props = {
  first: Exercise;
  second: Exercise;
  onOpenReps: (exId: string, setIdx: number, target: number, current: number | null) => void;
};

export function SupersetGroup({ first, second, onOpenReps }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs font-semibold tracking-[0.2em] text-amber-300">SUPERSET</div>
      <div className="mt-3 grid gap-4">
        <ExerciseRow exercise={first} onOpenReps={onOpenReps} />
        <ExerciseRow exercise={second} onOpenReps={onOpenReps} />
      </div>
    </div>
  );
}

