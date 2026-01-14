using Microsoft.EntityFrameworkCore;
using PumpLogApi.Entities;

namespace PumpLogApi.Data;

public class PumpLogDbContext : DbContext
{
    public DbSet<Session> Sessions { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<BodyPart> BodyParts { get; set; }
    public DbSet<Exercise> Exercises { get; set; }

    public PumpLogDbContext(DbContextOptions<PumpLogDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Session>(entity =>
        {
            entity.HasKey(session => session.SessionGuid);
            entity.Property(session => session.SessionGuid).HasDefaultValueSql("gen_random_uuid()");
        });

        modelBuilder.Entity<Section>(entity =>
        {
            entity.ToTable("Sections");
            entity.HasDiscriminator<string>("SectionType")
                .HasValue<HypertrophySection>("Strength")
                .HasValue<CrossfitSection>("Crossfit");
            entity.HasKey(section => section.SectionGuid);
            entity.Property(section => section.SectionGuid).HasDefaultValueSql("gen_random_uuid()");

            entity.HasOne(s => s.Session)
                     .WithMany(ts => ts.Sections)
                     .HasForeignKey(s => s.SessionGuid)
                     .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BodyPart>(entity =>
        {
            entity.HasKey(e => e.BodyPartGuid);
            entity.Property(e => e.BodyPartGuid).HasDefaultValueSql("gen_random_uuid()");

            entity.HasData(
                new BodyPart { BodyPartGuid = Guid.Parse("3f8e1a2b-4c5d-6e7f-8a9b-0c1d2e3f4a5b"), Name = "Brust" },
                new BodyPart { BodyPartGuid = Guid.Parse("9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d"), Name = "Rücken" },
                new BodyPart { BodyPartGuid = Guid.Parse("5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b"), Name = "Schultern" },
                new BodyPart { BodyPartGuid = Guid.Parse("1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f"), Name = "Bizeps" },
                new BodyPart { BodyPartGuid = Guid.Parse("7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d"), Name = "Trizeps" },
                new BodyPart { BodyPartGuid = Guid.Parse("2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e"), Name = "Beine" },
                new BodyPart { BodyPartGuid = Guid.Parse("3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b"), Name = "Beine (Quadrizeps)" },
                new BodyPart { BodyPartGuid = Guid.Parse("9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f"), Name = "Beine (Beuger)" },
                new BodyPart { BodyPartGuid = Guid.Parse("5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d"), Name = "Waden" },
                new BodyPart { BodyPartGuid = Guid.Parse("1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b"), Name = "Gesäß" },
                new BodyPart { BodyPartGuid = Guid.Parse("7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f"), Name = "Bauch" },
                new BodyPart { BodyPartGuid = Guid.Parse("3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d"), Name = "Nacken" }
            );
        });

        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.ExerciseGuid);
            entity.Property(e => e.ExerciseGuid).HasDefaultValueSql("gen_random_uuid()");

            entity.HasOne(e => e.BodyPart)
                  .WithMany()
                  .HasForeignKey(e => e.BodyPartGuid)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        base.OnModelCreating(modelBuilder);
    }
}
