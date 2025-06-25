using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PumpLogApi.Entities
{
    public class StrengthSet
    {
        public Guid StrengthSetGuid { get; set; }
        public Guid SectionGuid { get; set; }
        public required StrengthSection StrengthSection { get; set; }
        public decimal Weight { get; set; }
        public int Reps { get; set; }
        public int SetNumber { get; set; }
        public bool IsFinished { get; set; } = false;
    }
}