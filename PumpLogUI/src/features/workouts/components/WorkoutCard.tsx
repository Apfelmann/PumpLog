import { Button, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import type { Workout, Exercise } from "../types";
import { ExerciseRow } from "./ExerciseRow";
import { SupersetGroup } from "./SupersetGroup";
import type { ReactNode } from "react";

type Props = {
  workout: Workout;
  expanded: boolean;
  onToggle: (id: string) => void;
  onComplete: (id: string) => void;
  onOpenReps: (
    exId: string,
    setIdx: number,
    target: number,
    current: number | null
  ) => void;
};

export const WorkoutCard = ({
  workout,
  expanded,
  onToggle,
  onComplete,
  onOpenReps,
}: Props) => {
  const Icon = getCategoryIcon(workout);
  const exerciseCount =
    workout.exercises.length || workout.wod?.parts.length || 0;
  return (
    <div className="rounded-[24px] border border-white/10 bg-gradient-to-b from-zinc-800/70 to-neutral-900 px-6 py-5 shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-amber-300">
            <Icon fontSize="medium" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">
              {workout.name}
            </div>
            <div className="text-sm text-white/70">
              {workout.durationMin} min{" "}
              <span className="mx-2 text-white/40">+</span> {exerciseCount}{" "}
              Übungen
            </div>
          </div>
        </div>
        <IconButton
          onClick={() => onToggle(workout.id)}
          className="!border !border-amber-300/60 !text-amber-300"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>

      {expanded && (
        <div className="mt-5 space-y-4 border-t border-white/10 pt-5 text-white/90">
          {renderBody(workout, onOpenReps)}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="contained"
              onClick={() => onComplete(workout.id)}
              className="!rounded-2xl !bg-emerald-400/90 !px-4 !py-2 !text-black hover:!bg-emerald-400"
            >
              Workout abschließen
            </Button>
            <Button
              variant="outlined"
              className="!rounded-2xl"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Nach oben
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

function renderBody(
  workout: Workout,
  onOpenReps: (
    exId: string,
    setIdx: number,
    target: number,
    current: number | null
  ) => void
) {
  if (workout.type.includes("crossfit") && workout.wod) {
    return (
      <div className="space-y-2 text-white">
        <div className="text-white/70">{workout.wod.title}</div>
        <ul className="list-disc space-y-1 pl-5 text-white">
          {workout.wod.parts.map((part, idx) => (
            <li key={idx}>{part}</li>
          ))}
        </ul>
        {workout.wod.vest && (
          <div className="text-xs text-amber-300">Gewichtsweste empfohlen</div>
        )}
      </div>
    );
  }

  const blocks: ReactNode[] = [];
  for (let i = 0; i < workout.exercises.length; i += 1) {
    const exercise = workout.exercises[i];
    if (exercise.supersetWithNext && workout.exercises[i + 1]) {
      const next: Exercise = workout.exercises[i + 1];
      blocks.push(
        <SupersetGroup
          key={exercise.id}
          first={exercise}
          second={next}
          onOpenReps={onOpenReps}
        />
      );
      i += 1;
      continue;
    }
    blocks.push(
      <ExerciseRow
        key={exercise.id}
        exercise={exercise}
        onOpenReps={onOpenReps}
      />
    );
  }

  return <div className="space-y-4">{blocks}</div>;
}

function getCategoryIcon(workout: Workout) {
  switch (workout.category) {
    // case "legs":
    //   return DirectionsRunIcon;
    // case "cardio":
    //   return FavoriteBorderIcon;
    // case "crossfit":
    //   return FlashOnIcon;
    // case "strongmen":
    //   return SportsKabaddiIcon;
    default:
      return FitnessCenterIcon;
  }
}
