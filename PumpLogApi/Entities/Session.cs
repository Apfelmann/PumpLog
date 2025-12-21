using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Storage.Json;
namespace PumpLogApi.Entities
{
    public class Session
    {
        [Key]
        public string? Title { get; set; }
        public required Guid SessionGuid { get; set; }
        public required int SessionNumber { get; set; }
        public bool? IsCompleted { get; set; }
        public required Guid UserGuid { get; set; }
        public bool? IsDeleted { get; set; }
        public string? FocusedBodyPart { get; set; }
        public IList<Section>? Sections { get; set; }
        public required DateTime CreationDate { get; set; }
    }
}