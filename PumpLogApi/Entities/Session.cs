using System.ComponentModel.DataAnnotations;
namespace PumpLogApi.Entities
{
    public class Session
    {
        [Key]
        public required Guid SessionGuid { get; set; }
        public required int SessionNumber { get; set; }
        public required bool IsActive { get; set; } = true;
        public required Guid UserGuid { get; set; }
        public required bool isDeleted {get; set;}
        public IList<Section>? Sections { get; set; } = new List<Section>();
        public DateTime creationDate{get; set;}
    }
}