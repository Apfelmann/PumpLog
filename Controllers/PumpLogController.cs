using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PumpLogApi.Entities;
using PumpLogApi.Managers;

namespace PumpLogApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class PumpLogController : ControllerBase
    {
        private readonly PumpLogManager _pumpLogManager;

        public PumpLogController(PumpLogManager pumpLogManager)
        {
            _pumpLogManager = pumpLogManager;
        }

        [HttpGet("ActiveSessions")]
        public async Task<ActionResult<IEnumerable<Session>>> GetActiveSessions()
        {
            // This is a placeholder for the actual implementation.
            // You would typically retrieve the active sessions from a database or other data source.
            var activeSessions = await _pumpLogManager.GetActiveSessions();
            return Ok(activeSessions);
        }

        [HttpPost]
        public async Task<ActionResult<Session>> SaveSession([FromBody] Session session)
        {
            var result = await _pumpLogManager.SaveSession(session);
            return result switch
            {
                SaveSessionResult.Created => Ok(new { message = "Session created successfully" }),
                SaveSessionResult.Updated => Ok(new { message = "Session updated successfully" }),
                SaveSessionResult.AlreadyExists => Conflict(
                    new { message = "Session already exists" }
                ),
                SaveSessionResult.Error => StatusCode(
                    500,
                    new { message = "An error occurred while saving the session" }
                ),
                _ => BadRequest(new { message = "Invalid session data" }),
            };
        }
    }
}
