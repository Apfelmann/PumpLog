import React, { useState, useEffect } from "react";
import { Typography, IconButton, Button, Popover } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinkIcon from "@mui/icons-material/Link";
import { useGetExercisesQuery } from "../../services/exerciseApi";
import type { Exercise } from "../../models/exercise";
import { ExerciseInput } from "./components/ExerciseInput";
import type { HypertrophySection } from "../../models/section";

interface HypertrophySectionProps {
  section?: HypertrophySection;
  sessionGuid: string;
  onSave?: (sectionData: Omit<HypertrophySection, "session">) => void;
  onDelete?: () => void;
}

export const HypertrophySectionCard: React.FC<HypertrophySectionProps> = ({
  section,
  sessionGuid,
  onSave,
  onDelete,
}) => {
  const { data: exercises = [], isLoading } = useGetExercisesQuery();

  const [isEditing, setIsEditing] = useState(!section);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [weight, setWeight] = useState<number>(section?.weight || 0);
  const [sets, setSets] = useState<number>(section?.sets || 0);
  const [reps, setReps] = useState<number>(section?.reps || 0);
  const [isSuperset, setIsSuperset] = useState(
    section?.supersetWithNext || false
  );

  useEffect(() => {
    if (section && exercises.length > 0) {
      const found = exercises.find(
        (e) => e.exerciseGuid === section.exerciseGuid
      );
      if (found) {
        setSelectedExercise(found);
      }
    }
  }, [section, exercises]);

  // Results state: { [setIndex]: repsAchieved }
  const [mainSetResults, setMainSetResults] = useState<Record<number, number>>(
    () => {
      if (!section?.setResults) return {};
      return section.setResults.split(",").reduce((acc, val, idx) => {
        const num = parseInt(val, 10);
        if (!isNaN(num)) {
          acc[idx] = num;
        }
        return acc;
      }, {} as Record<number, number>);
    }
  );

  // Helper function to save setResults to backend
  const saveSetResults = (resultsToSave: Record<number, number>) => {
    if (!section?.sectionGuid || !selectedExercise || !onSave) return;

    const resultArray: string[] = [];
    for (let i = 0; i < sets; i++) {
      if (resultsToSave[i] !== undefined) {
        resultArray.push(resultsToSave[i].toString());
      } else {
        resultArray.push("0");
      }
    }
    const setResultsString = resultArray.join(",");

    const sectionData: Omit<HypertrophySection, "session"> = {
      sectionGuid: section.sectionGuid,
      sessionGuid: sessionGuid,
      order: section.order,
      sectionType: "Hypertrophy",
      exerciseGuid: selectedExercise.exerciseGuid,
      exerciseName: selectedExercise.name,
      supersetWithNext: isSuperset,
      weight: weight,
      reps: reps,
      sets: sets,
      setResults: setResultsString,
    };

    onSave(sectionData);
  };

  // Popover state for adjusting reps
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLDivElement | null>(
    null
  );
  const [activeSet, setActiveSet] = useState<{
    index: number;
    targetReps: number;
  } | null>(null);

  const handleSave = () => {
    if (!selectedExercise || !onSave) return;

    const targetSets = sets;
    const targetRepsVal = reps;
    const weightVal = weight;

    const resultArray: string[] = [];
    for (let i = 0; i < targetSets; i++) {
      if (mainSetResults[i] !== undefined) {
        resultArray.push(mainSetResults[i].toString());
      } else {
        resultArray.push("0");
      }
    }
    const setResultsString = resultArray.join(",");

    const sectionData: Omit<HypertrophySection, "session"> = {
      sectionGuid: section?.sectionGuid || undefined,
      sessionGuid: sessionGuid,
      order: section?.order || 0,
      sectionType: "Hypertrophy",
      exerciseGuid: selectedExercise.exerciseGuid,
      exerciseName: selectedExercise.name,
      supersetWithNext: isSuperset,
      weight: weightVal,
      reps: targetRepsVal,
      sets: targetSets,
      setResults: setResultsString,
    };

    onSave(sectionData);
    setIsEditing(false);
  };

  const handleSetClick = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
    targetReps: number
  ) => {
    const val = mainSetResults[index];

    if (val === undefined) {
      // First click: set target reps and save immediately
      const newResults = { ...mainSetResults, [index]: targetReps };
      setMainSetResults(newResults);
      saveSetResults(newResults);
    } else {
      // Already has value: open popover to adjust
      setPopoverAnchor(e.currentTarget);
      setActiveSet({ index, targetReps });
    }
  };

  const handleAdjustReps = (delta: number) => {
    if (!activeSet) return;
    const { index, targetReps } = activeSet;
    const currentVal = mainSetResults[index] || 0;
    const newVal = Math.max(0, Math.min(targetReps, currentVal + delta));
    setMainSetResults({ ...mainSetResults, [index]: newVal });
  };

  const handleResetSet = () => {
    if (!activeSet) return;
    const { index } = activeSet;
    const newResults = { ...mainSetResults };
    delete newResults[index];
    setMainSetResults(newResults);
    saveSetResults(newResults);
    setPopoverAnchor(null);
  };

  const handlePopoverClose = () => {
    // Save when closing popover (after adjusting reps)
    saveSetResults(mainSetResults);
    setPopoverAnchor(null);
  };

  const renderSetBubbles = (
    count: number,
    results: Record<number, number>,
    targetReps: number
  ) => {
    return Array.from({ length: count }).map((_, idx) => {
      const actualReps = results[idx];
      const isCompleted = actualReps !== undefined;
      const isTargetMet = actualReps === targetReps;

      return (
        <div
          key={idx}
          onClick={(e) => handleSetClick(e, idx, targetReps)}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border transition-all select-none text-sm font-medium
            ${
              isCompleted
                ? isTargetMet
                  ? "bg-amber-300 border-amber-300 text-black shadow-[0_0_10px_rgba(252,211,77,0.5)]"
                  : "bg-red-500/20 border-red-400 text-red-200"
                : "bg-transparent border-white/20 text-white/40 hover:border-amber-300/50 hover:text-white/80"
            }
          `}
        >
          {isCompleted ? (
            isTargetMet ? (
              <CheckIcon fontSize="small" />
            ) : (
              actualReps
            )
          ) : (
            idx + 1
          )}
        </div>
      );
    });
  };

  return (
    <div className="rounded-[24px] border border-white/10 bg-gradient-to-b from-zinc-800/70 to-neutral-900 px-6 py-5 shadow-xl mb-4 text-white relative">
      {isSuperset && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-10 bg-zinc-900 border border-white/10 rounded-full p-1.5 shadow-lg">
          <LinkIcon className="text-amber-300" fontSize="small" />
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Typography variant="h6" className="text-amber-300 font-semibold">
            {section ? section.exerciseName : "Neue Übung"}
          </Typography>
          {isSuperset && (
            <span className="text-xs font-bold bg-amber-300/10 text-amber-300 px-2 py-0.5 rounded border border-amber-300/20">
              Supersatz
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <IconButton
              onClick={() => setIsEditing(true)}
              size="small"
              className="!text-amber-300"
            >
              <EditIcon />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              onClick={onDelete}
              size="small"
              className="!text-red-400"
            >
              <DeleteOutlineIcon />
            </IconButton>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <ExerciseInput
                exercises={exercises}
                selectedExercise={selectedExercise}
                onExerciseChange={setSelectedExercise}
                weight={weight}
                onWeightChange={setWeight}
                sets={sets}
                onSetsChange={setSets}
                reps={reps}
                onRepsChange={setReps}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isSuperset ? "contained" : "outlined"}
              size="small"
              onClick={() => setIsSuperset(!isSuperset)}
              className={
                isSuperset
                  ? "!bg-amber-300 !text-black"
                  : "!text-white/50 !border-white/20"
              }
            >
              {isSuperset ? "Supersatz aktiv" : "Als Supersatz markieren"}
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            {section && (
              <Button
                onClick={() => setIsEditing(false)}
                className="!text-white/50"
              >
                Abbrechen
              </Button>
            )}
            <Button
              onClick={handleSave}
              variant="contained"
              className="!bg-amber-300 !text-black hover:!bg-amber-400"
            >
              Fertig
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <div className="flex items-baseline gap-1 text-amber-300/90 font-mono">
                <span className="text-xl font-bold">{weight}</span>
                <span className="text-xs text-amber-300/60 uppercase tracking-wider">
                  kg
                </span>
                <span className="mx-2 text-white/20">|</span>
                <span className="text-xl font-bold">{sets}</span>
                <span className="text-xs text-amber-300/60 uppercase tracking-wider">
                  Sets
                </span>
                <span className="mx-2 text-white/20">|</span>
                <span className="text-xl font-bold">{reps}</span>
                <span className="text-xs text-amber-300/60 uppercase tracking-wider">
                  Reps
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              {renderSetBubbles(sets, mainSetResults, reps)}
            </div>
          </div>
        </div>
      )}

      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          className:
            "!bg-neutral-800 !border !border-white/10 !rounded-xl !text-white !p-3 !mt-2",
        }}
      >
        {activeSet && (
          <div className="flex flex-col gap-3 min-w-[140px]">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <Typography className="text-xs text-white/50 uppercase tracking-wider font-medium">
                Satz {activeSet.index + 1}
              </Typography>
              <IconButton
                size="small"
                onClick={handleResetSet}
                className="!text-white/30 hover:!text-red-400 !p-0.5"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </div>

            <div className="flex items-center justify-between gap-3">
              <IconButton
                onClick={() => handleAdjustReps(-1)}
                className="!bg-white/5 hover:!bg-white/10 !text-white !border !border-white/10 !w-8 !h-8"
              >
                <RemoveIcon fontSize="small" />
              </IconButton>

              <Typography className="text-xl font-bold font-mono w-8 text-center">
                {mainSetResults[activeSet.index]}
              </Typography>

              <IconButton
                onClick={() => handleAdjustReps(1)}
                className="!bg-white/5 hover:!bg-white/10 !text-white !border !border-white/10 !w-8 !h-8"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        )}
      </Popover>
    </div>
  );
};
