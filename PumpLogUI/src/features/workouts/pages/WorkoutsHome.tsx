import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { SessionCard } from "../components/SessionCard";
import { RepsModal, type RepsModalState } from "../components/RepsModal";
import { Header } from "./Header";
import {
  useGetSessionsQuery,
  useSaveSessionMutation,
} from "../../../services/sessionApi";
import { usePumpLogSelector } from "../../../store/storehooks";

export const WorkoutsHome = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modal, setModal] = useState<RepsModalState>({ open: false });
  const [saveSession] = useSaveSessionMutation();
  const userSession = usePumpLogSelector((state) => state.user.session);
  void userSession; // TODO: wird später verwendet

  const { data: sessions = [] } = useGetSessionsQuery();

  const toggleExpanded = (id: string) =>
    setExpandedId((current) => (current === id ? null : id));

  const _openReps = (
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
  void _openReps; // TODO: wird später verwendet

  const addWorkout = async () => {
    try {
      await saveSession({}).unwrap();
    } catch (e) {
      alert("Fehler beim Speichern: " + JSON.stringify(e));
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-zinc-950 via-[#08080c] to-neutral-900 pb-32 text-white ">
      <Header />
      <div className="mx-auto w-full max-w-4xl">
        <main className="px-5 pt-8">
          <div className="flex flex-col gap-4">
            {sessions.map((session) => (
              <SessionCard
                key={session.userGuid}
                session={session}
                expanded={expandedId === session.sessionGuid}
                onToggle={() => toggleExpanded(session.sessionGuid)}
              />
            ))}
          </div>
          {sessions.length === 0 && (
            <div className="mt-10 text-center text-white/60">
              Noch keine Workouts geplant.
            </div>
          )}
        </main>
      </div>

      <Fab
        color="primary"
        size="medium"
        className="!bg-amber-300 !text-black fixed shadow-2xl z-50"
        onClick={addWorkout}
      >
        <AddIcon />
      </Fab>

      <RepsModal state={modal} onClose={() => setModal({ open: false })} />
    </div>
  );
};
