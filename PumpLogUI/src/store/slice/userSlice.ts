import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  profile: Record<string, unknown>;
}

export interface UserState {
  session: UserSession | null;
}

const initialState: UserState = {
  session: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<UserSession>) {
      state.session = action.payload;
    },
    clearSession(state) {
      state.session = null;
    },
  },
});

export const { setSession, clearSession } = userSlice.actions;

export default userSlice.reducer;
