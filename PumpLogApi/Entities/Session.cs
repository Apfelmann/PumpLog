using System.ComponentModel.DataAnnotations;
namespace PumpLogApi.Entities
{
    public class Session
    {
        [Key]
        public required Guid SessionGuid { get; set; }
        public int SessionNumber { get; set; }
        public IList<Section> Sections { get; set; } = new List<Section>();
        public bool IsActive { get; set; } = true;
        public required Guid UserGuid { get; set; }
    }
}