import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const usePumpLogDispatch = () => useDispatch<AppDispatch>();
export const usePumpLogSelector: TypedUseSelectorHook<RootState> = useSelector;
