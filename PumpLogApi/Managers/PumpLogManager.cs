using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PumpLogApi.Data;
using PumpLogApi.Entities;

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
        Task<SaveSessionResult> SaveSession(Session session);
    }

    public class PumpLogManager : IPumpLogManager
    {
        private readonly PumpLogDbContext _context;

        public PumpLogManager(PumpLogDbContext context)
        {
            _context = context;
        }

        public async Task<List<Session>> GetActiveSessions()
        {
            List<Session> activeSessions = await _context
                .Sessions.Where(x => x.IsActive == true)
                .ToListAsync();
            return activeSessions;
        }

        public async Task<SaveSessionResult> SaveSession(Session session)
        {
            var loadedSession = await _context
                .Sessions.Include(session => session.Sections)
                .ThenInclude(section => (section as StrengthSection).StrengthSets)
                .FirstOrDefaultAsync(x => x.SessionGuid == session.SessionGuid);

            if (loadedSession == null)
            {
                _context.Sessions.Add(session);
                await _context.SaveChangesAsync();
                return SaveSessionResult.Created;
            }

            _context.Entry(loadedSession).CurrentValues.SetValues(session);

            foreach (var section in session.Sections)
            {
                var loadedSection = loadedSession.Sections.FirstOrDefault(s =>
                    s.SectionGuid == section.SectionGuid
                );

                if (loadedSection == null)
                {
                    loadedSession.Sections.Add(section);
                }
                else
                {
                    _context.Entry(loadedSection).CurrentValues.SetValues(section);

                    if (
                        section is StrengthSection strengthSection
                        && loadedSection is StrengthSection loadedStrengthSection
                    )
                    {
                        foreach (var set in strengthSection.StrengthSets)
                        {
                            var loadedSet = loadedStrengthSection.StrengthSets.FirstOrDefault(ss =>
                                ss.SectionGuid == set.StrengthSetGuid
                            );

                            if (loadedSet == null)
                            {
                                loadedStrengthSection.StrengthSets.Add(set);
                            }
                            else
                            {
                                _context.Entry(loadedSet).CurrentValues.SetValues(set);
                            }
                        }
                        var setsToRemove = loadedStrengthSection
                            .StrengthSets.Where(ss =>
                                !strengthSection.StrengthSets.Any(s =>
                                    s.StrengthSetGuid == ss.StrengthSetGuid
                                )
                            )
                            .ToList();

                        foreach (var setToRemove in setsToRemove)
                        {
                            loadedStrengthSection.StrengthSets.Remove(setToRemove);
                        }
                    }
                }
            }
            var sectionsToRemove = loadedSession
                .Sections.Where(s => !session.Sections.Any(sec => sec.SectionGuid == s.SectionGuid))
                .ToList();
            foreach (var section in sectionsToRemove)
                loadedSession.Sections.Remove(section);

            await _context.SaveChangesAsync();
            return SaveSessionResult.AlreadyExists;
        }
    }
}
