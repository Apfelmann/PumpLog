using System.ComponentModel.DataAnnotations;

namespace PumpLogApi.Entities
{
    public class Exercise
    {
        [Key]
        public Guid ExerciseGuid { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public Guid BodyPartGuid { get; set; }
        public BodyPart? BodyPart { get; set; }
    }
}
