type Props = {
  index: number;
  achieved: number | null | undefined;
  target: number;
  onClick: () => void;
};

export function SetChip({ index, achieved, target, onClick }: Props) {
  const done = typeof achieved === "number";
  const label = done ? `${achieved}/${target}` : `S${index + 1}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-12 h-12 rounded-lg border text-sm font-medium transition ${
        done
          ? "border-emerald-300/70 bg-emerald-300/10"
          : "border-white/20 bg-white/5 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

