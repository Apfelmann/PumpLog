using System;

namespace PumpLogApi.Models
{
    public class StrengthSetRequest
    {
        public Guid? StrengthSetGuid { get; set; }
        public Guid? SectionGuid { get; set; }
        public decimal? Weight { get; set; }
        public int? Reps { get; set; }
        public int? SetNumber { get; set; }
        public bool? IsFinished { get; set; }
    }
}
