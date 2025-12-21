using System.ComponentModel.DataAnnotations;

namespace PumpLogApi.Entities
{
    public class BodyPart
    {
        [Key]
        public Guid BodyPartGuid { get; set; }
        public required string Name { get; set; }
    }
}
