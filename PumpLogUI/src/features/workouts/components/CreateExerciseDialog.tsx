import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import {
  useGetBodyPartsQuery,
  useCreateExerciseMutation,
} from "../../../services/exerciseApi";
import type { BodyPart } from "../../../models/exercise";

interface CreateExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  initialName: string;
  onExerciseCreated: (exerciseName: string) => void;
}

export const CreateExerciseDialog: React.FC<CreateExerciseDialogProps> = ({
  open,
  onClose,
  initialName,
  onExerciseCreated,
}) => {
  const {
    data: bodyParts = [],
    isLoading: isLoadingBodyParts,
    error: bodyPartsError,
  } = useGetBodyPartsQuery();
  const [createExercise, { isLoading: isCreating }] =
    useCreateExerciseMutation();

  const [name, setName] = useState(initialName);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setName(initialName);
      setSelectedBodyPart(null);
    }
  }, [open, initialName]);

  const handleSave = async () => {
    if (!name || !selectedBodyPart) return;

    try {
      await createExercise({
        name,
        bodyPartGuid: selectedBodyPart.bodyPartGuid,
      }).unwrap();
      onExerciseCreated(name);
      onClose();
    } catch (error) {
      console.error("Failed to create exercise:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "!bg-neutral-900 !border !border-white/10 !text-white",
      }}
    >
      <DialogTitle className="!text-amber-300">
        Neue Übung erstellen
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4 min-w-[300px] pt-4">
        {bodyPartsError && (
          <div className="text-red-500 text-sm">
            Fehler beim Laden der Muskelgruppen. Ist das Backend aktuell?
          </div>
        )}
        <TextField
          autoFocus
          label="Name der Übung"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            marginTop: 1,
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

        <Autocomplete
          options={bodyParts}
          getOptionLabel={(option) => option.name}
          value={selectedBodyPart}
          onChange={(_, newValue) => setSelectedBodyPart(newValue)}
          loading={isLoadingBodyParts}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "#171717",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                "& .MuiAutocomplete-option": {
                  "&[aria-selected='true']": {
                    backgroundColor: "rgba(255, 255, 255, 0.16)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                },
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Muskelgruppe"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#fcd34d" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fcd34d" },
                "& .MuiSvgIcon-root": { color: "white" },
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions className="!p-4">
        <Button onClick={onClose} className="!text-white/60 hover:!text-white">
          Abbrechen
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!name || !selectedBodyPart || isCreating}
          className="!bg-amber-300 !text-black hover:!bg-amber-400"
          startIcon={
            isCreating ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          Erstellen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
