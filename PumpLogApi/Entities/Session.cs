using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Storage.Json;
namespace PumpLogApi.Entities
{
    public class Session
    {
        [Key]
        public string? Title { get; set; }
        public Guid? SessionGuid { get; set; }
        public int? SessionNumber { get; set; }
        public bool? IsCompleted { get; set; }
        public Guid? UserGuid { get; set; }
        public bool? isDeleted { get; set; }
        public IList<Section>? Sections { get; set; }
        public DateTime? CreationDate { get; set; }
    }
}