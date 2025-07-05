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
        Error
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
            List<Session> activeSessions = await _context.Sessions.Where(x => x.IsActive == true).ToListAsync();
            return activeSessions;
        }

        public async Task<SaveSessionResult> SaveSession(Session session)
        {
            var sessionExisting = await _context.Sessions.AnyAsync(x => x.SessionGuid == session.SessionGuid);
            if (sessionExisting == false)
            {
                _context.Sessions.Add(session);
                await _context.SaveChangesAsync();
                return SaveSessionResult.Created;
            }

            // Add Update Session if Session already exist :)
            return SaveSessionResult.AlreadyExists;
        }

    }
}