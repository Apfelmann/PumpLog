import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Section, Session } from "../../models/section";

interface SessionState {
  sessions: Session[];
}

const initialState: SessionState = {
  sessions: [],
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
    },
    removeSection: (state, action: PayloadAction<string>) => {
      state.sessions.forEach((session) => {
        if (session.sections) {
          session.sections = session.sections.filter(
            (s) => s.sectionGuid !== action.payload
          );
        }
      });
    },
  },
});

export const { setSessions, removeSection } = sessionSlice.actions;

export default sessionSlice.reducer;
