import { Button, IconButton, Input, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import type { Session } from "../types";
import { useState } from "react";
import { useSaveSessionMutation } from "../../../services/sessionApi";
import { HypertrophySection } from "../HypertrophySection";
import type { StrengthSection } from "../../../models/section";

type Props = {
  session?: any;
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

export const SessionCard = ({
  session,
  expanded,
  onToggle,
  onComplete,
  onOpenReps,
}: Props) => {
  const [title, setTitle] = useState(session?.title);
  const [saveSession] = useSaveSessionMutation();
  const [showAddSection, setShowAddSection] = useState(false);
  const Icon = getCategoryIcon(session);
  const exerciseCount = session?.sections?.length || 0;

  const sanitizeSection = (section: any) => {
    // Remove circular references and ensure clean DTO
    const { session, ...rest } = section;
    return rest;
  };

  const handleSectionUpdate = (updatedSection: StrengthSection) => {
    const updatedSections = session.sections.map((s: any) =>
      s.sectionGuid === updatedSection.sectionGuid ? updatedSection : s
    );

    saveSession({
      ...session,
      sections: updatedSections.map(sanitizeSection),
    });
  };

  const handleAddSection = (newSectionData: any) => {
    // Set order to be last
    const order = (session.sections?.length || 0) + 1;
    const sectionToAdd = { ...newSectionData, order };

    const newSections = [...(session.sections || []), sectionToAdd];

    saveSession({
      ...session,
      sections: newSections.map(sanitizeSection),
    });
    setShowAddSection(false);
  };

  return (
    <div className="rounded-[24px] border border-white/10 bg-gradient-to-b from-zinc-800/70 to-neutral-900 px-6 py-5 shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-amber-300">
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
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                defaultValue={title || "Title einfügen"}
                value={title}
              />
              {session.title !== title && (
                <>
                  <IconButton
                    color="success"
                    onClick={() => saveSession({ ...session, title })}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setTitle(session.title || "Title einfügen")}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              )}
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
            <HypertrophySection
              key={section.sectionGuid}
              section={section}
              onSave={handleSectionUpdate}
              onDelete={() => {
                const newSections = session.sections.filter(
                  (s: any) => s.sectionGuid !== section.sectionGuid
                );
                saveSession({ ...session, sections: newSections });
              }}
            />
          ))}

          {showAddSection ? (
            <HypertrophySection
              onSave={handleAddSection}
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

function getCategoryIcon(workout?: Session) {
  switch (workout?.category) {
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
