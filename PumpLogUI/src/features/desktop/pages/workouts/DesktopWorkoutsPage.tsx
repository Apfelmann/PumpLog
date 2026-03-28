import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Fab } from "@mui/material";
import { DesktopSessionCard } from "./DesktopSessionCard";
import {
  useGetSessionsQuery,
  useSaveSessionMutation,
} from "../../../../services/sessionApi";

export const DesktopWorkoutsPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saveSession] = useSaveSessionMutation();

  const { data: rawSessions = [] } = useGetSessionsQuery();

  // Sort sessions: newest (highest sessionNumber) first
  const sessions = [...rawSessions].sort(
    (a, b) => b.sessionNumber - a.sessionNumber
  );

  const toggleExpanded = (id: string) =>
    setExpandedId((current) => (current === id ? null : id));

  const addWorkout = async () => {
    try {
      await saveSession({}).unwrap();
    } catch {
      alert("Ein Fehler ist beim Erstellen des Workouts aufgetreten. Bitte versuche es erneut.");
    }
  };

  const totalExercises = sessions.reduce(
    (sum, s) => sum + (s.sections?.length ?? 0),
    0
  );

  return (
    <div className="min-h-[100dvh] text-white">
      {/* Page header */}
      <header className="sticky top-0 z-10 border-b border-white/8 bg-[#0d0d12]/90 backdrop-blur-md px-8 py-6">
        <p className="text-xs uppercase tracking-[0.35em] text-white/50 mb-1">
          Dein Trainingsplan
        </p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-300 flex items-center gap-3">
              <FitnessCenterIcon sx={{ fontSize: 28 }} />
              Workouts
            </h1>
            <p className="text-sm text-white/60 mt-1">
              {sessions.length} {sessions.length === 1 ? "Einheit" : "Einheiten"}{" "}
              &bull; {totalExercises} Übungen gesamt
            </p>
          </div>

          <button
            onClick={addWorkout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-300 text-black text-sm font-semibold hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(252,211,77,0.25)]"
          >
            <AddIcon sx={{ fontSize: 18 }} />
            Neues Workout
          </button>
        </div>
      </header>

      {/* Session list */}
      <main className="px-8 py-6 max-w-5xl">
        {sessions.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-4 text-white/40">
            <FitnessCenterIcon sx={{ fontSize: 56 }} />
            <p className="text-lg">Noch keine Workouts geplant.</p>
            <button
              onClick={addWorkout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-300 text-black text-sm font-semibold hover:bg-amber-400 transition-colors"
            >
              <AddIcon sx={{ fontSize: 18 }} />
              Erstes Workout erstellen
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <DesktopSessionCard
                key={session.sessionGuid}
                session={session}
                expanded={expandedId === session.sessionGuid}
                onToggle={() => toggleExpanded(session.sessionGuid)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating action button (secondary shortcut) */}
      <Fab
        color="primary"
        size="medium"
        className="!bg-amber-300 !text-black fixed shadow-2xl z-50 !bottom-8 !right-8"
        onClick={addWorkout}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};
