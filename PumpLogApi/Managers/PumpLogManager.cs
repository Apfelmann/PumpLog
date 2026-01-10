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
        Task<Section> SaveSection(SectionRequest section);
        Task<bool> DeleteSection(Guid sectionGuid);
        Task<List<Exercise>> GetAllExercises();
        Task<Exercise> CreateExercise(Exercise exercise);
        Task<List<BodyPart>> GetAllBodyParts();
        Task<Session> FinishWorkout(Guid sessionGuid);
    }

    public class PumpLogManager(PumpLogDbContext _context, ICurrentUserService currentUserService) : IPumpLogManager
    {

        private static bool IsStrength(SectionRequest section) =>
            string.Equals(section.SectionType, "Strength", StringComparison.OrdinalIgnoreCase);

        private static bool IsCrossfit(SectionRequest section) =>
            string.Equals(section.SectionType, "Crossfit", StringComparison.OrdinalIgnoreCase);

        private static bool IsHypertrophy(SectionRequest section) =>
            string.Equals(section.SectionType, "Hypertrophy", StringComparison.OrdinalIgnoreCase);

        private static Section CreateSectionEntity(SectionRequest sectionRequest, Session session)
        {
            var sectionGuid = sectionRequest.SectionGuid ?? Guid.NewGuid();
            var order = sectionRequest.Order ?? 0;
            var supersetWithNext = sectionRequest.SupersetWithNext ?? false;

            if (IsHypertrophy(sectionRequest))
            {
                var hypertrophySection = new HypertrophySection
                {
                    SectionGuid = sectionGuid,
                    SessionGuid = session.SessionGuid,
                    Session = session,
                    Order = order,
                    SupersetWithNext = supersetWithNext,
                    ExerciseGuid = sectionRequest.ExerciseGuid ?? Guid.Empty,
                    ExerciseName = sectionRequest.ExerciseName ?? string.Empty,
                    Weight = sectionRequest.Weight ?? 0,
                    Reps = sectionRequest.Reps ?? 0,
                    Sets = sectionRequest.Sets ?? 0,
                    SetResults = sectionRequest.SetResults ?? string.Empty,
                };

                return hypertrophySection;
            }

            if (IsCrossfit(sectionRequest))
            {
                return new CrossfitSection
                {
                    SectionGuid = sectionGuid,
                    SessionGuid = session.SessionGuid,
                    Session = session,
                    Order = order,
                    ExerciseGuid = sectionRequest.ExerciseGuid ?? Guid.Empty,
                    WodName = sectionRequest.WodName ?? string.Empty,
                    Description = sectionRequest.Description ?? string.Empty,
                };
            }

            throw new ArgumentException("Invalid section type");
        }


        public async Task<Section> SaveSection(SectionRequest sectionRequest)
        {
            if (sectionRequest == null || sectionRequest.SessionGuid == null)
            {
                throw new ArgumentException("Invalid section request");
            }

            var session = await _context.Sessions.FirstOrDefaultAsync(s => s.SessionGuid == sectionRequest.SessionGuid);
            if (session == null)
            {
                throw new ArgumentException("Session not found");
            }

            Section? existingSection = null;
            if (sectionRequest.SectionGuid.HasValue)
            {
                existingSection = await _context.Sections.FirstOrDefaultAsync(s => s.SectionGuid == sectionRequest.SectionGuid);
            }

            if (existingSection == null)
            {
                // Create new section
                var newSection = CreateSectionEntity(sectionRequest, session);
                _context.Sections.Add(newSection);
                await _context.SaveChangesAsync();
                return newSection;
            }
            else
            {
                // Update existing section
                if (sectionRequest.Order.HasValue)
                {
                    existingSection.Order = sectionRequest.Order.Value;
                }
                if (sectionRequest.SupersetWithNext.HasValue)
                {
                    existingSection.SupersetWithNext = sectionRequest.SupersetWithNext.Value;
                }
                if (sectionRequest.ExerciseGuid.HasValue)
                {
                    existingSection.ExerciseGuid = sectionRequest.ExerciseGuid.Value;
                }

                if (existingSection is CrossfitSection loadedCrossfit)
                {
                    if (sectionRequest.WodName != null) loadedCrossfit.WodName = sectionRequest.WodName;
                    if (sectionRequest.Description != null) loadedCrossfit.Description = sectionRequest.Description;
                }

                if (existingSection is HypertrophySection loadedStrength)
                {
                    if (sectionRequest.ExerciseName != null) loadedStrength.ExerciseName = sectionRequest.ExerciseName;
                    if (sectionRequest.Weight.HasValue) loadedStrength.Weight = sectionRequest.Weight.Value;
                    if (sectionRequest.Reps.HasValue) loadedStrength.Reps = sectionRequest.Reps.Value;
                    if (sectionRequest.Sets.HasValue) loadedStrength.Sets = sectionRequest.Sets.Value;
                    if (sectionRequest.SetResults != null) loadedStrength.SetResults = sectionRequest.SetResults;
                }

                await _context.SaveChangesAsync();
                return existingSection;
            }
        }


        public async Task<List<Session>> GetActiveSessions()
        {
            List<Session> activeSessions = await _context
                .Sessions
                .Include(s => s.Sections)
                .Where(x => x.UserGuid == Guid.Parse(currentUserService.Id) && x.IsDeleted == false && x.IsCompleted == false)
                .OrderBy(s => s.CreationDate)
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
                    if (sectionRequest.ExerciseGuid.HasValue)
                    {
                        loadedSection.ExerciseGuid = sectionRequest.ExerciseGuid.Value;
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

                    if (loadedSection is HypertrophySection loadedStrength)
                    {
                        if (sectionRequest.ExerciseName != null)
                        {
                            loadedStrength.ExerciseName = sectionRequest.ExerciseName;
                        }
                        if (sectionRequest.Weight.HasValue)
                        {
                            loadedStrength.Weight = sectionRequest.Weight.Value;
                        }
                        if (sectionRequest.Reps.HasValue)
                        {
                            loadedStrength.Reps = sectionRequest.Reps.Value;
                        }
                        if (sectionRequest.Sets.HasValue)
                        {
                            loadedStrength.Sets = sectionRequest.Sets.Value;
                        }
                        if (sectionRequest.SetResults != null)
                        {
                            loadedStrength.SetResults = sectionRequest.SetResults;
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

        public async Task<bool> DeleteSection(Guid sectionGuid)
        {
            var section = await _context.Sections.FirstOrDefaultAsync(s => s.SectionGuid == sectionGuid);
            if (section == null)
            {
                return false;
            }

            _context.Sections.Remove(section);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Session> FinishWorkout(Guid sessionGuid)
        {
            var session = await _context.Sessions
                .Include(s => s.Sections)
                .FirstOrDefaultAsync(s => s.SessionGuid == sessionGuid && s.UserGuid == Guid.Parse(currentUserService.Id));

            if (session == null)
            {
                throw new ArgumentException("Session not found");
            }

            // Mark current session as completed
            session.IsCompleted = true;
            await _context.SaveChangesAsync();

            // Create new session
            var newSession = new Session
            {
                Title = session.Title,
                FocusedBodyPart = session.FocusedBodyPart,
                UserGuid = Guid.Parse(currentUserService.Id),
                IsDeleted = false,
                IsCompleted = false,
                SessionGuid = Guid.NewGuid(),
                SessionNumber = (_context.Sessions
                    .Where(s => s.UserGuid == Guid.Parse(currentUserService.Id))
                    .Max(s => (int?)s.SessionNumber) ?? 0) + 1,
                CreationDate = DateTime.UtcNow,
                Sections = new List<Section>()
            };

            // Copy sections with progressive overload logic
            if (session.Sections != null)
            {
                foreach (var oldSection in session.Sections.OrderBy(s => s.Order))
                {
                    if (oldSection is HypertrophySection oldHypertrophy)
                    {
                        var newWeight = oldHypertrophy.Weight;
                        var newSetResults = oldHypertrophy.SetResults;

                        // Check if all sets achieved target reps
                        var setResultsArray = oldHypertrophy.SetResults
                            .Split(',', StringSplitOptions.RemoveEmptyEntries)
                            .Select(s => int.TryParse(s.Trim(), out var val) ? val : 0)
                            .ToList();

                        var allSetsCompleted = setResultsArray.Count == oldHypertrophy.Sets &&
                                               setResultsArray.All(reps => reps >= oldHypertrophy.Reps);

                        if (allSetsCompleted)
                        {
                            // Increase weight by 1 kg
                            newWeight += 1;
                            // Reset completed reps to 0 for all sets
                            newSetResults = string.Join(",", Enumerable.Repeat("0", oldHypertrophy.Sets));
                        }

                        var newHypertrophy = new HypertrophySection
                        {
                            SectionGuid = Guid.NewGuid(),
                            SessionGuid = newSession.SessionGuid,
                            Session = newSession,
                            Order = oldSection.Order,
                            SupersetWithNext = oldSection.SupersetWithNext,
                            ExerciseGuid = oldSection.ExerciseGuid,
                            ExerciseName = oldHypertrophy.ExerciseName,
                            Weight = newWeight,
                            Reps = oldHypertrophy.Reps,
                            Sets = oldHypertrophy.Sets,
                            SetResults = newSetResults
                        };

                        newSession.Sections.Add(newHypertrophy);
                    }
                    else if (oldSection is CrossfitSection oldCrossfit)
                    {
                        var newCrossfit = new CrossfitSection
                        {
                            SectionGuid = Guid.NewGuid(),
                            SessionGuid = newSession.SessionGuid,
                            Session = newSession,
                            Order = oldSection.Order,
                            SupersetWithNext = oldSection.SupersetWithNext,
                            ExerciseGuid = oldSection.ExerciseGuid,
                            WodName = oldCrossfit.WodName,
                            Description = oldCrossfit.Description
                        };

                        newSession.Sections.Add(newCrossfit);
                    }
                }
            }

            _context.Sessions.Add(newSession);
            await _context.SaveChangesAsync();

            return newSession;
        }
    }
}
