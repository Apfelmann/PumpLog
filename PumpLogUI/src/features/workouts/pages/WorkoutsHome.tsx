import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import type { Workout } from "../types";
import { WorkoutCard } from "../components/WorkoutCard";
import { RepsModal, type RepsModalState } from "../components/RepsModal";
import { progressWorkout } from "../progression";
import { Header } from "./Header";
import { AddWorkoutDialog } from "../components/AddWorkoutDialog/AddWorkoutDialog";
import {
  useGetSessionsQuery,
  useSaveSessionMutation,
} from "../../../services/sessionApi";

export const WorkoutsHome = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => []);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modal, setModal] = useState<RepsModalState>({ open: false });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [saveSession] = useSaveSessionMutation();
  const { data } = useGetSessionsQuery();
  console.log("Fetched sessions data:", data);

  const toggleExpanded = (id: string) =>
    setExpandedId((current) => (current === id ? null : id));

  const openReps = (
    woId: string,
    exId: string,
    setIdx: number,
    target: number,
    value: number | null
  ) => {
    setModal({
      open: true,
      woId,
      exId,
      setIdx,
      target,
      value: value ?? target,
    });
  };

  const saveReps = (value: number) => {
    if (!(modal.woId && modal.exId && typeof modal.setIdx === "number")) {
      return;
    }

    setWorkouts((prev) =>
      prev.map((workout) => {
        if (workout.id !== modal.woId) return workout;
        const clone = JSON.parse(JSON.stringify(workout)) as Workout;
        const exercise = clone.exercises.find((ex) => ex.id === modal.exId);
        if (!exercise) return workout;
        if (!exercise.achieved) {
          exercise.achieved = new Array(exercise.sets).fill(null);
        }
        exercise.achieved[modal.setIdx!] = value;
        return clone;
      })
    );
    setModal({ open: false });
  };

  const completeWorkout = (id: string) => {
    setWorkouts((prev) => {
      const target = prev.find((w) => w.id === id);
      if (!target) return prev;
      const progressed = progressWorkout(target);
      return [...prev.filter((w) => w.id !== id), progressed];
    });
    setExpandedId(null);
  };

  const addWorkout = () => {
    try {
      saveSession({});
    } catch (e) {
      console.log("Error saving session:", e);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-zinc-950 via-[#08080c] to-neutral-900 pb-32 text-white">
      <Header />
      <div className="mx-auto w-full max-w-4xl">
        <main className="px-5 pt-8">
          <div className="flex flex-col gap-4">
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                expanded={expandedId === workout.id}
                onToggle={toggleExpanded}
                onComplete={completeWorkout}
                onOpenReps={(exId, setIdx, target, current) =>
                  openReps(workout.id, exId, setIdx, target, current)
                }
              />
            ))}
          </div>
          {workouts.length === 0 && (
            <div className="mt-10 text-center text-white/60">
              Noch keine Workouts geplant.
            </div>
          )}
        </main>
      </div>

      <Fab
        color="primary"
        className="!bg-amber-300 !text-black fixed bottom-8 left-200 shadow-2xl"
        onClick={addWorkout}
      >
        <AddIcon />
      </Fab>

      <RepsModal
        state={modal}
        onClose={() => setModal({ open: false })}
        onSave={saveReps}
      />
      {isOpen && <AddWorkoutDialog onClose={() => setIsOpen(false)} />}
    </div>
  );
};
