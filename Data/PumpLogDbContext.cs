using Microsoft.EntityFrameworkCore;
using PumpLogApi.Entities;

namespace PumpLogApi.Data;

public class PumpLogDbContext : DbContext
{
    public DbSet<Session> Sessions { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<StrengthSet> StrengthSets { get; set; }

    public PumpLogDbContext(DbContextOptions<PumpLogDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Session>(entity =>
        {
            entity.HasKey(session => session.SessionGuid);
            entity.Property(session=> session.SessionGuid).HasDefaultValueSql("gen_random_uuid()");
        });

        modelBuilder.Entity<Section>(entity =>
        {
            entity.ToTable("Sections");
            entity.HasDiscriminator<string>("SectionType")
                .HasValue<StrengthSection>("Strength")
                .HasValue<CrossfitSection>("Crossfit");
            entity.HasKey(section => section.SectionGuid);
            entity.Property(section => section.SectionGuid).HasDefaultValueSql("gen_random_uuid()");

             entity.HasOne(s => s.Session)
                      .WithMany(ts => ts.Sections)
                      .HasForeignKey(s => s.SessionGuid)
                      .OnDelete(DeleteBehavior.Cascade);
        });

           modelBuilder.Entity<StrengthSet>(entity =>
            {
                entity.HasKey(strengthSet => strengthSet.StrengthSetGuid);
                entity.Property(strengthSet => strengthSet.StrengthSetGuid)
                      .HasDefaultValueSql("gen_random_uuid()");

                entity.HasOne(strengthSet => strengthSet.StrengthSection)
                      .WithMany(section => section.StrengthSets)
                      .HasForeignKey(strengthSet => strengthSet.SectionGuid)
                      .OnDelete(DeleteBehavior.Cascade);
            });

        base.OnModelCreating(modelBuilder);
    }
}
