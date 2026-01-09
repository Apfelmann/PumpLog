import { Button, IconButton, Input } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useRef } from "react";
import {
  useSaveSectionMutation,
  useSaveSessionMutation,
  useDeleteSectionMutation,
} from "../../../services/sessionApi";
import { HypertrophySectionCard } from "../HypertrophySection";
import type { Session, HypertrophySection } from "../../../models/section";

type Props = {
  session?: any;
  expanded: boolean;
  onToggle: (id: string) => void;
  onComplete: (id: string) => void;
};

export const SessionCard = ({
  session,
  expanded,
  onToggle,
  onComplete,
}: Props) => {
  const [saveSection] = useSaveSectionMutation();
  const [saveSession] = useSaveSessionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [showAddSection, setShowAddSection] = useState(false);
  const [title, setTitle] = useState(session?.title || "");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const deleteIconRef = useRef<HTMLDivElement>(null);
  const Icon = isConfirmingDelete ? CloseIcon : getCategoryIcon(session);
  const exerciseCount = session?.sections?.length || 0;

  // Sync local state with session prop changes
  useEffect(() => {
    setTitle(session?.title || "");
  }, [session?.title]);

  // Handle click outside to cancel delete confirmation
  useEffect(() => {
    if (!isConfirmingDelete) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (deleteIconRef.current && event.target && !deleteIconRef.current.contains(event.target as Node)) {
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
        // Revert to original title on error
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
    } catch (error) {
      console.error("Failed to delete session:", error);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <div
      className={`rounded-[24px] border px-6 py-5 shadow-xl transition-colors ${
        isConfirmingDelete
          ? "border-red-500/50 bg-gradient-to-b from-red-900/30 to-red-950/50"
          : "border-white/10 bg-gradient-to-b from-zinc-800/70 to-neutral-900"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            ref={deleteIconRef}
            onClick={handleDeleteClick}
            onKeyDown={(e) => e.key === "Enter" && handleDeleteClick()}
            role="button"
            tabIndex={0}
            className={`rounded-2xl border p-3 cursor-pointer transition-colors ${
              isConfirmingDelete
                ? "border-red-500/50 bg-red-900/30 text-red-400"
                : "border-white/10 bg-black/30 text-amber-300 hover:border-white/20"
            }`}
          >
            <Icon fontSize="medium" />
          </div>
          <div>
            <div>
              <Input
                size="small"
                inputProps={{
                  className: "text-lg font-semibold tracking-tight text-white",
                }}
                sx={{
                  color: "white",
                  marginRight: "8px",
                }}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                value={title}
                placeholder="Title einfügen"
              />
            </div>
            <div className="text-sm text-white/70">
              <div></div>
              <span className="mx-2 text-white/40">+</span> {exerciseCount}{" "}
              Übungen
            </div>
          </div>
        </div>
        <IconButton
          onClick={() => onToggle(session?.id || "")}
          className="!border !border-amber-300/60 !text-amber-300"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>

      {expanded && (
        <div className="mt-5 space-y-4 border-t border-white/10 pt-5 text-white/90">
          {session.sections?.map((section: any) => (
            <HypertrophySectionCard
              key={section.sectionGuid}
              section={section}
              sessionGuid={session.sessionGuid}
              onSave={handleSectionUpdate}
              onDelete={() => handleSectionDelete(section.sectionGuid)}
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
              className="!w-full !border-dashed !border-white/20 !text-white/50 hover:!text-white hover:!border-white/40 !py-4"
            >
              Übung hinzufügen
            </Button>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              variant="contained"
              onClick={() => onComplete(session?.id || "")}
              className="!rounded-2xl !bg-emerald-400/90 !px-4 !py-2 !text-black hover:!bg-emerald-400"
            >
              Workout abschließen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

function getCategoryIcon(workout?: Session) {
  return FitnessCenterIcon;
}
