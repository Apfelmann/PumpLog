import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useState } from "react";

export type RepsModalState = {
  open: boolean;
  woId?: string;
  exId?: string;
  setIdx?: number;
  target?: number;
  value?: number;
};

type Props = {
  state: RepsModalState;
  onClose: () => void;
};

export function RepsModal({ state, onClose }: Props) {
  const [value, setValue] = useState(state.value ?? state.target ?? 0);

  useEffect(() => {
    if (state.open) {
      setValue(state.value ?? state.target ?? 0);
    }
  }, [state.open, state.value, state.target]);

  return (
    <Dialog open={state.open} onClose={onClose} fullWidth>
      <DialogTitle>
        Wiederholungen erfassen
        {state.target ? ` (Ziel ${state.target})` : ""}
      </DialogTitle>
      <DialogContent>
        <div className="flex items-center justify-center gap-4 py-3">
          <IconButton
            color="primary"
            onClick={() => setValue((prev) => Math.max(0, prev - 1))}
          >
            <RemoveIcon />
          </IconButton>
          <div className="w-16 text-center text-4xl font-semibold text-white">
            {value}
          </div>
          <IconButton
            color="primary"
            onClick={() => setValue((prev) => prev + 1)}
          >
            <AddIcon />
          </IconButton>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {[0, 3, 5, 8, 10].map((quick) => (
            <Button
              key={quick}
              variant="outlined"
              onClick={() => setValue(quick)}
            >
              {quick}
            </Button>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="success" variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
