using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace PumpLogApi.Entities
{
    [JsonPolymorphic(TypeDiscriminatorPropertyName = "sectionType")]
    [JsonDerivedType(typeof(HypertrophySection), typeDiscriminator: "Hypertrophy")]
    [JsonDerivedType(typeof(CrossfitSection), typeDiscriminator: "Crossfit")]
    public class Section
    {
        public Guid SectionGuid { get; set; }
        public Guid SessionGuid { get; set; }
        [JsonIgnore]
        public Session? Session { get; set; }
        public required Guid ExerciseGuid { get; set; }
        public int Order { get; set; }
        public bool SupersetWithNext { get; set; }

    }

    public class CrossfitSection : Section
    {
        public required string WodName { get; set; }
        public required string Description { get; set; }
    }
    public class HypertrophySection : Section
    {
        public required string ExerciseName { get; set; }
        public decimal Weight { get; set; }
        public int Reps { get; set; }
        public int Sets { get; set; }
        public string SetResults { get; set; } = string.Empty;
    }
}