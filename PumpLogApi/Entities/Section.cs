using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PumpLogApi.Entities
{
    public class Section
    {
        public Guid SectionGuid { get; set; }
        public Guid SessionGuid { get; set; }
        public required Session Session { get; set; }
        public int Order { get; set; }
        public bool SupersetWithNext { get; set; }

    }

    public class CrossfitSection : Section
    {
        public required string WodName { get; set; }
        public required string Description { get; set; }
    }
    public class StrengthSection : Section
    {
        public required string ExerciseName { get; set; }
        public IList<StrengthSet> StrengthSets { get; set; } = new List<StrengthSet>();
    }
}