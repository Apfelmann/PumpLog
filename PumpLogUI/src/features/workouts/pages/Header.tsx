export const Header = () => {
  return (
    <header className="rounded-b-3xl border-t-4 border-amber-400/80 bg-[#121217] px-6 py-8 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
      <p className="text-sm uppercase tracking-[0.35em] text-white/60">
        Dein Trainingsplan
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-amber-300">Workouts</h1>
          <p className="text-sm text-white/70">
            {"workouts.length"} Einheiten • {"totalDuration"} min
          </p>
        </div>
        <p className="text-sm text-white/60">
          {"totalExercises"} Übungen gesamt
        </p>
      </div>
    </header>
  );
};
