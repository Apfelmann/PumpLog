using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PumpLogApi.Data;
using PumpLogApi.Entities;
using PumpLogApi.Models;

namespace PumpLogApi.Managers
{
    public enum SaveSessionResult
    {
        Created,
        Updated,
        AlreadyExists,
        Error,
    }

    public interface IPumpLogManager
    {
        Task<List<Session>> GetActiveSessions();
        Task<SaveSessionResult> SaveSession(SessionRequest session);
        Task<List<Exercise>> GetAllExercises();
        Task<Exercise> CreateExercise(Exercise exercise);
        Task<List<BodyPart>> GetAllBodyParts();
    }

    public class PumpLogManager(PumpLogDbContext _context, ICurrentUserService currentUserService) : IPumpLogManager
    {

        private static bool IsStrength(SectionRequest section) =>
            string.Equals(section.SectionType, "Strength", StringComparison.OrdinalIgnoreCase)
            || section.ExerciseName != null
            || section.StrengthSets != null;

        private static bool IsCrossfit(SectionRequest section) =>
            string.Equals(section.SectionType, "Crossfit", StringComparison.OrdinalIgnoreCase)
            || section.WodName != null
            || section.Description != null;

        private static Section CreateSectionEntity(SectionRequest sectionRequest, Session session)
        {
            var sectionGuid = sectionRequest.SectionGuid ?? Guid.NewGuid();
            var order = sectionRequest.Order ?? 0;
            var supersetWithNext = sectionRequest.SupersetWithNext ?? false;

            if (IsStrength(sectionRequest))
            {
                var strengthSection = new StrengthSection
                {
                    SectionGuid = sectionGuid,
                    SessionGuid = session.SessionGuid,
                    Session = session,
                    Order = order,
                    SupersetWithNext = supersetWithNext,
                    ExerciseName = sectionRequest.ExerciseName ?? string.Empty,
                    StrengthSets = new List<StrengthSet>(),
                };

                if (sectionRequest.StrengthSets != null)
                {
                    foreach (var setRequest in sectionRequest.StrengthSets)
                    {
                        strengthSection.StrengthSets.Add(new StrengthSet
                        {
                            StrengthSetGuid = setRequest.StrengthSetGuid ?? Guid.NewGuid(),
                            SectionGuid = strengthSection.SectionGuid,
                            StrengthSection = strengthSection,
                            Weight = setRequest.Weight ?? 0,
                            Reps = setRequest.Reps ?? 0,
                            SetNumber = setRequest.SetNumber ?? 0,
                            IsFinished = setRequest.IsFinished ?? false,
                        });
                    }
                }

                return strengthSection;
            }

            if (IsCrossfit(sectionRequest))
            {
                return new CrossfitSection
                {
                    SectionGuid = sectionGuid,
                    SessionGuid = session.SessionGuid,
                    Session = session,
                    Order = order,
                    WodName = sectionRequest.WodName ?? string.Empty,
                    Description = sectionRequest.Description ?? string.Empty,
                };
            }

            return new Section
            {
                SectionGuid = sectionGuid,
                SessionGuid = session.SessionGuid,
                Session = session,
                Order = order,
            };
        }


        public async Task<List<Session>> GetActiveSessions()
        {
            List<Session> activeSessions = await _context
                .Sessions.Where(x => x.UserGuid == Guid.Parse(currentUserService.Id) && x.IsDeleted == false && x.IsCompleted == false)
                .ToListAsync();
            return activeSessions;
        }

        public async Task<SaveSessionResult> SaveSession(SessionRequest request)
        {
            if (request == null)
            {
                return SaveSessionResult.Error;
            }

            var loadedSession = await _context
                .Sessions.Include(session => session.Sections)
                .ThenInclude(section => (section as StrengthSection).StrengthSets)
                .FirstOrDefaultAsync(x => request.SessionGuid != null && x.SessionGuid == request.SessionGuid);

            // If session does not exist, create it
            if (loadedSession == null)
            {
                var newSession = new Session
                {
                    Title = request.Title,
                    FocusedBodyPart = request.FocusedBodyPart,
                    Sections = null,
                    UserGuid = Guid.Parse(currentUserService.Id),
                    IsDeleted = request.IsDeleted ?? false,
                    IsCompleted = request.IsCompleted ?? false,
                    SessionGuid = Guid.NewGuid(),
                    SessionNumber = (_context.Sessions
                    .Where(s => s.UserGuid == Guid.Parse(currentUserService.Id))
                    .Max(s => (int?)s.SessionNumber) ?? 0) + 1
                    ,
                    CreationDate = DateTime.UtcNow,
                };

                if (request.Sections != null)
                {
                    newSession.Sections = new List<Section>();
                    foreach (var sectionRequest in request.Sections)
                    {
                        newSession.Sections.Add(CreateSectionEntity(sectionRequest, newSession));
                    }
                }

                _context.Sessions.Add(newSession);
                await _context.SaveChangesAsync();

                return SaveSessionResult.Created;
            }

            // Patch semantics: only update provided fields
            if (request.Title != null)
            {
                loadedSession.Title = request.Title;
            }
            if (request.IsCompleted.HasValue)
            {
                loadedSession.IsCompleted = request.IsCompleted.Value;
            }
            if (request.IsDeleted.HasValue)
            {
                loadedSession.IsDeleted = request.IsDeleted.Value;
            }
            if (request.FocusedBodyPart != null)
            {
                loadedSession.FocusedBodyPart = request.FocusedBodyPart;
            }

            // Sections patch: only if client sent sections
            if (request.Sections != null)
            {
                loadedSession.Sections ??= new List<Section>();

                foreach (var sectionRequest in request.Sections)
                {
                    var incomingGuid = sectionRequest.SectionGuid;
                    var loadedSection = incomingGuid.HasValue
                        ? loadedSession.Sections.FirstOrDefault(s => s.SectionGuid == incomingGuid.Value)
                        : null;

                    if (loadedSection == null)
                    {
                        loadedSession.Sections.Add(CreateSectionEntity(sectionRequest, loadedSession));
                        continue;
                    }

                    if (sectionRequest.Order.HasValue)
                    {
                        loadedSection.Order = sectionRequest.Order.Value;
                    }

                    if (loadedSection is CrossfitSection loadedCrossfit)
                    {
                        if (sectionRequest.WodName != null)
                        {
                            loadedCrossfit.WodName = sectionRequest.WodName;
                        }
                        if (sectionRequest.Description != null)
                        {
                            loadedCrossfit.Description = sectionRequest.Description;
                        }
                    }

                    if (loadedSection is StrengthSection loadedStrength)
                    {
                        if (sectionRequest.ExerciseName != null)
                        {
                            loadedStrength.ExerciseName = sectionRequest.ExerciseName;
                        }

                        if (sectionRequest.StrengthSets != null)
                        {
                            foreach (var setRequest in sectionRequest.StrengthSets)
                            {
                                var setGuid = setRequest.StrengthSetGuid;
                                var loadedSet = setGuid.HasValue
                                    ? loadedStrength.StrengthSets.FirstOrDefault(ss => ss.StrengthSetGuid == setGuid.Value)
                                    : null;

                                if (loadedSet == null)
                                {
                                    loadedStrength.StrengthSets.Add(new StrengthSet
                                    {
                                        StrengthSetGuid = setRequest.StrengthSetGuid ?? Guid.NewGuid(),
                                        SectionGuid = loadedStrength.SectionGuid,
                                        StrengthSection = loadedStrength,
                                        Weight = setRequest.Weight ?? 0,
                                        Reps = setRequest.Reps ?? 0,
                                        SetNumber = setRequest.SetNumber ?? 0,
                                        IsFinished = setRequest.IsFinished ?? false,
                                    });
                                    continue;
                                }

                                if (setRequest.Weight.HasValue)
                                {
                                    loadedSet.Weight = setRequest.Weight.Value;
                                }
                                if (setRequest.Reps.HasValue)
                                {
                                    loadedSet.Reps = setRequest.Reps.Value;
                                }
                                if (setRequest.SetNumber.HasValue)
                                {
                                    loadedSet.SetNumber = setRequest.SetNumber.Value;
                                }
                                if (setRequest.IsFinished.HasValue)
                                {
                                    loadedSet.IsFinished = setRequest.IsFinished.Value;
                                }
                            }

                            var incomingSetGuids = sectionRequest.StrengthSets
                                .Where(s => s.StrengthSetGuid.HasValue)
                                .Select(s => s.StrengthSetGuid!.Value)
                                .ToHashSet();

                            var setsToRemove = loadedStrength.StrengthSets
                                .Where(ss => !incomingSetGuids.Contains(ss.StrengthSetGuid))
                                .ToList();

                            foreach (var setToRemove in setsToRemove)
                            {
                                loadedStrength.StrengthSets.Remove(setToRemove);
                            }
                        }
                    }
                }

                var sectionsToRemove = loadedSession.Sections
                    .Where(s => !request.Sections.Any(sec => sec.SectionGuid.HasValue && sec.SectionGuid.Value == s.SectionGuid))
                    .ToList();

                foreach (var section in sectionsToRemove)
                {
                    loadedSession.Sections.Remove(section);
                }
            }


            await _context.SaveChangesAsync();
            return SaveSessionResult.Updated;
        }

        public async Task<List<Exercise>> GetAllExercises()
        {
            return await _context.Exercises.Include(e => e.BodyPart).ToListAsync();
        }

        public async Task<Exercise> CreateExercise(Exercise exercise)
        {
            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();
            return exercise;
        }

        public async Task<List<BodyPart>> GetAllBodyParts()
        {
            return await _context.BodyParts.ToListAsync();
        }
    }
}
