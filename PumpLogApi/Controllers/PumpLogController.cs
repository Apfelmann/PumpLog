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
        private readonly IPumpLogManager _pumpLogManager;

        public PumpLogController(IPumpLogManager pumpLogManager)
        {
            _pumpLogManager = pumpLogManager;
        }

        [HttpGet("ActiveSessions")]
        public async Task<ActionResult<IEnumerable<Session>>> GetActiveSessions()
        {
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
