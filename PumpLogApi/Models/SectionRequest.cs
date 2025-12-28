using System;
using System.Collections.Generic;

namespace PumpLogApi.Models
{
    public class SectionRequest
    {
        public Guid? SectionGuid { get; set; }
        public Guid? SessionGuid { get; set; }
        public int? Order { get; set; }
        public bool? SupersetWithNext { get; set; }

        // Optional discriminator aligned with EF discriminator values: "Strength" | "Crossfit"
        public string? SectionType { get; set; }

        // Crossfit
        public string? WodName { get; set; }
        public string? Description { get; set; }

        // Strength
        public string? ExerciseName { get; set; }
        public Guid? ExerciseGuid { get; set; }
        public decimal? Weight { get; set; }
        public int? Reps { get; set; }
        public int? Sets { get; set; }
        public string? SetResults { get; set; }
    }
}
