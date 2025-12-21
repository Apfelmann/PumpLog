import React, { useState } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import type { Exercise } from "../../../models/exercise";
import { CreateExerciseDialog } from "./CreateExerciseDialog";

interface ExerciseInputProps {
  exercises: Exercise[];
  selectedExercise: Exercise | null;
  onExerciseChange: (exercise: Exercise | null) => void;
  weight: number;
  onWeightChange: (value: number) => void;
  sets: number;
  onSetsChange: (value: number) => void;
  reps: number;
  onRepsChange: (value: number) => void;
  isLoading: boolean;
  label?: string;
}

const filter = createFilterOptions<Exercise>();

export const ExerciseInput: React.FC<ExerciseInputProps> = ({
  exercises,
  selectedExercise,
  onExerciseChange,
  weight,
  onWeightChange,
  sets,
  onSetsChange,
  reps,
  onRepsChange,
  isLoading,
  label = "Übung wählen",
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogValue, setDialogValue] = useState("");
  const [createdExerciseName, setCreatedExerciseName] = useState<string | null>(
    null
  );

  // Auto-select created exercise when it appears in the list
  React.useEffect(() => {
    if (createdExerciseName) {
      const newExercise = exercises.find((e) => e.name === createdExerciseName);
      if (newExercise) {
        onExerciseChange(newExercise);
        setCreatedExerciseName(null);
      }
    }
  }, [exercises, createdExerciseName, onExerciseChange]);

  const handleClose = () => {
    setDialogValue("");
    setOpenDialog(false);
  };

  const handleExerciseCreated = (newName: string) => {
    setCreatedExerciseName(newName);
  };

  // We need to handle the selection of the "Add" option
  const handleChange = (_: any, newValue: string | Exercise | null) => {
    if (typeof newValue === "string") {
      // User typed something and pressed enter (freeSolo) - though we don't use freeSolo prop directly for string input without option
      // But with filterOptions we can return a string option
      setDialogValue(newValue);
      setOpenDialog(true);
    } else if (newValue && (newValue as any).inputValue) {
      // User selected the "Add..." option
      setDialogValue((newValue as any).inputValue);
      setOpenDialog(true);
    } else {
      onExerciseChange(newValue as Exercise | null);
    }
  };

  return (
    <div>
      <Autocomplete
        value={selectedExercise}
        onChange={handleChange}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some(
            (option) => inputValue === option.name
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              name: `Hinzufügen: "${inputValue}"`,
            } as any);
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={exercises}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Add "xxx" option created dynamically
          if ((option as any).inputValue) {
            return (option as any).inputValue;
          }
          // Regular option
          return option.name;
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              {option.name}
            </li>
          );
        }}
        freeSolo
        loading={isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#fcd34d" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#fcd34d" },
              "& .MuiSvgIcon-root": { color: "white" },
            }}
          />
        )}
      />

      <CreateExerciseDialog
        open={openDialog}
        onClose={handleClose}
        initialName={dialogValue}
        onExerciseCreated={handleExerciseCreated}
      />

      <div className="flex gap-2 mt-3">
        <TextField
          label="Gewicht (kg)"
          type="number"
          value={weight}
          onChange={(e) => onWeightChange(Number(e.target.value))}
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
              "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#fcd34d" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#fcd34d" },
          }}
        />
        <TextField
          label="Sätze"
          type="number"
          value={sets}
          onChange={(e) => onSetsChange(Number(e.target.value))}
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
              "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#fcd34d" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#fcd34d" },
          }}
        />
        <TextField
          label="Reps"
          type="number"
          value={reps}
          onChange={(e) => onRepsChange(Number(e.target.value))}
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
              "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#fcd34d" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#fcd34d" },
          }}
        />
      </div>
    </div>
  );
};
