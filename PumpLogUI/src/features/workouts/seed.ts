import type { Workout } from "./types";

const baseAchieved = (sets: number) => Array.from({ length: sets }, () => null);

export const seedWorkouts = (): Workout[] => [
  upperHypertrophy(),
  legStrongmen(),
  wodMurph(),
];

function upperHypertrophy(): Workout {
  return {
    id: crypto.randomUUID(),
    name: "Oberkörper Hypertrophie",
    category: "upper",
    type: "hypertrophy",
    durationMin: 55,
    exercises: [
      {
        id: crypto.randomUUID(),
        kind: "hypertrophy",
        name: "Bankdrücken",
        weight: 80,
        sets: 4,
        targetReps: 8,
        achieved: baseAchieved(4),
      },
      {
        id: crypto.randomUUID(),
        kind: "hypertrophy",
        name: "Kurzhantel Schulterdrücken",
        weight: 26,
        sets: 4,
        targetReps: 10,
        achieved: baseAchieved(4),
        supersetWithNext: true,
      },
      {
        id: crypto.randomUUID(),
        kind: "hypertrophy",
        name: "Latziehen",
        weight: 60,
        sets: 4,
        targetReps: 12,
        achieved: baseAchieved(4),
      },
      {
        id: crypto.randomUUID(),
        kind: "hypertrophy",
        name: "Face Pulls",
        weight: 35,
        sets: 3,
        targetReps: 15,
        achieved: baseAchieved(3),
      },
    ],
  };
}

function legStrongmen(): Workout {
  return {
    id: crypto.randomUUID(),
    name: "Leg Day Strongmen",
    category: "legs",
    type: "strongmen",
    durationMin: 60,
    exercises: [
      {
        id: crypto.randomUUID(),
        kind: "strongmen",
        name: "Trap-Bar Deadlift",
        weight: 140,
        sets: 5,
        targetReps: 5,
        achieved: baseAchieved(5),
      },
      {
        id: crypto.randomUUID(),
        kind: "strongmen",
        name: "Front Squat",
        weight: 90,
        sets: 4,
        targetReps: 6,
        achieved: baseAchieved(4),
        supersetWithNext: true,
      },
      {
        id: crypto.randomUUID(),
        kind: "strongmen",
        name: "Farmer Walk",
        weight: 45,
        sets: 4,
        targetReps: 40,
        achieved: baseAchieved(4),
      },
    ],
  };
}

function wodMurph(): Workout {
  return {
    id: crypto.randomUUID(),
    name: "WOD: Murph",
    category: "crossfit",
    type: "crossfit",
    durationMin: 45,
    wod: {
      title: "Murph",
      parts: [
        "1 Meile Run",
        "100 Pull-ups",
        "200 Push-ups",
        "300 Air Squats",
        "1 Meile Run",
      ],
      vest: true,
    },
    exercises: [],
  };
}

