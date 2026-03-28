import { Button, IconButton, Input } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState, useEffect, useRef } from "react";
import {
  useSaveSectionMutation,
  useSaveSessionMutation,
  useDeleteSectionMutation,
  useFinishWorkoutMutation,
} from "../../../../services/sessionApi";
import { HypertrophySectionCard } from "../../../workouts/HypertrophySection";
import type { HypertrophySection } from "../../../../models/section";
import type { sessionResponse } from "../../../../models/saveSession";

type Props = {
  session: sessionResponse;
  expanded: boolean;
  onToggle: (id: string) => void;
};

export const DesktopSessionCard = ({
  session,
  expanded,
  onToggle,
}: Props) => {
  const [saveSection] = useSaveSectionMutation();
  const [saveSession] = useSaveSessionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [finishWorkout] = useFinishWorkoutMutation();
  const [showAddSection, setShowAddSection] = useState(false);
  const [title, setTitle] = useState(session?.title || "");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const deleteIconRef = useRef<HTMLDivElement>(null);
  const Icon = isConfirmingDelete ? CloseIcon : getCategoryIcon();
  const exerciseCount = session?.sections?.length || 0;

  useEffect(() => {
    setTitle(session?.title || "");
  }, [session?.title]);

  useEffect(() => {
    if (!isConfirmingDelete) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        deleteIconRef.current &&
        event.target &&
        !deleteIconRef.current.contains(event.target as Node)
      ) {
        setIsConfirmingDelete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isConfirmingDelete]);

  const handleSectionUpdate = async (
    updatedSection: Omit<HypertrophySection, "session">
  ) => {
    await saveSection(updatedSection).unwrap();
    setShowAddSection(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (
      title !== session?.title &&
      session?.sessionGuid &&
      session?.title !== undefined
    ) {
      try {
        await saveSession({
          sessionGuid: session.sessionGuid,
          userGuid: session.userGuid,
          title: title,
          sections: session.sections,
          isCompleted: session.isActive,
        }).unwrap();
      } catch (error) {
        console.error("Failed to save session title:", error);
        setTitle(session?.title || "");
      }
    }
  };

  const handleSectionDelete = async (sectionGuid: string) => {
    await deleteSection(sectionGuid).unwrap();
  };

  const handleDeleteClick = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    try {
      await saveSession({
        sessionGuid: session.sessionGuid,
        userGuid: session.userGuid,
        title: session.title,
        sections: session.sections,
        isCompleted: session.isActive,
        isDeleted: true,
      }).unwrap();
      setIsConfirmingDelete(false);
    } catch (error) {
      console.error("Failed to delete session:", error);
      setIsConfirmingDelete(false);
    }
  };

  const handleFinishWorkout = async () => {
    try {
      await finishWorkout(session.sessionGuid).unwrap();
    } catch (error) {
      console.error("Failed to finish workout:", error);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-colors ${
        isConfirmingDelete
          ? "border-red-500/40 bg-gradient-to-r from-red-900/20 to-red-950/30"
          : "border-white/8 bg-gradient-to-r from-zinc-800/60 to-neutral-900/80"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-5 px-6 py-4">
        {/* Session number badge */}
        <div className="text-xs font-mono text-white/30 w-8 text-right shrink-0">
          #{session.sessionNumber}
        </div>

        {/* Category icon / delete trigger */}
        <div
          ref={deleteIconRef}
          onClick={handleDeleteClick}
          onKeyDown={(e) => e.key === "Enter" && handleDeleteClick()}
          role="button"
          tabIndex={0}
          className={`rounded-xl border p-2.5 cursor-pointer transition-colors shrink-0 ${
            isConfirmingDelete
              ? "border-red-500/50 bg-red-900/30 text-red-400"
              : "border-white/10 bg-black/30 text-amber-300 hover:border-white/20"
          }`}
        >
          <Icon fontSize="small" />
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <Input
            size="small"
            inputProps={{
              className: "text-base font-semibold tracking-tight text-white",
            }}
            sx={{ color: "white" }}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            value={title}
            placeholder="Titel einfügen"
            disableUnderline={false}
          />
          <div className="text-sm text-white/50 mt-0.5">
            {exerciseCount} {exerciseCount === 1 ? "Übung" : "Übungen"}
          </div>
        </div>

        {/* Status badge */}
        {session?.isActive === false && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 shrink-0">
            <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
            <span>Abgeschlossen</span>
          </div>
        )}

        {/* Expand toggle */}
        <IconButton
          onClick={() => onToggle(session?.sessionGuid || "")}
          className="!border !border-amber-300/40 !text-amber-300 shrink-0"
          size="small"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-6 pb-5 border-t border-white/8 pt-5 space-y-4">
          {(session.sections as HypertrophySection[] | undefined)?.map((section) => (
            <HypertrophySectionCard
              key={section.sectionGuid}
              section={section}
              sessionGuid={session.sessionGuid}
              onSave={handleSectionUpdate}
              onDelete={() => handleSectionDelete(section.sectionGuid ?? "")}
            />
          ))}

          {showAddSection ? (
            <HypertrophySectionCard
              sessionGuid={session.sessionGuid}
              onSave={handleSectionUpdate}
              onDelete={() => setShowAddSection(false)}
            />
          ) : (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowAddSection(true)}
              className="!w-full !border-dashed !border-white/20 !text-white/50 hover:!text-white hover:!border-white/40 !py-3"
            >
              Übung hinzufügen
            </Button>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="contained"
              onClick={handleFinishWorkout}
              className="!rounded-xl !bg-emerald-400/90 !px-5 !py-2 !text-black hover:!bg-emerald-400"
            >
              Workout abschließen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

function getCategoryIcon() {
  return FitnessCenterIcon;
}
