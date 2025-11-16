type Props = {
  onClose: () => void;
};

export const AddWorkoutDialog = ({ onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 bg-[#101014]/95 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Neues Workout</h2>
          <button
            type="button"
            className="text-sm font-medium text-white/60 transition hover:text-white"
            onClick={onClose}
          >
            Schließen
          </button>
        </div>
        <div className="text-sm text-white/60">
          {/* Inhalte für die Workout-Erstellung einfügen */}
        </div>
      </div>
    </div>
  );
};
