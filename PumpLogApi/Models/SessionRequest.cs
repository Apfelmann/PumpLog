using System;
using System.Collections.Generic;

namespace PumpLogApi.Models
{
    public class SessionRequest
    {
        public string? Title { get; set; }
        public Guid? SessionGuid { get; set; }
        public int? SessionNumber { get; set; }
        public bool? IsCompleted { get; set; }
        public Guid? UserGuid { get; set; }
        public bool? IsDeleted { get; set; }
        public string? FocusedBodyPart { get; set; }
        public IList<SectionRequest>? Sections { get; set; }
        public DateTime? CreationDate { get; set; }
    }
}
