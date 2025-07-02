using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PumpLogApi.Entities;

namespace PumpLogApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class PumpLogController : ControllerBase
    {
        [HttpGet("ActiveSessions")]
        public async Task<ActionResult<IEnumerable<Session>>> GetActiveSessions()
        {
            // This is a placeholder for the actual implementation.
            // You would typically retrieve the active sessions from a database or other data source.
            var activeSessions = new List<Session>
            {
                new Session { SessionGuid = Guid.NewGuid(), SessionNumber = 1, UserGuid = Guid.NewGuid() },
                new Session { SessionGuid = Guid.NewGuid(), SessionNumber = 2, UserGuid = Guid.NewGuid() }
            };

            return Ok(activeSessions);

        }
        // [HttpGet("Session/{sessionGuid}")]
        // public async Task<ActionResult<Session>> GetSession(Guid sessionGuid)
        // {
        // }

        // [HttpPost("CreateSession")]
        // public async Task<ActionResult<Session>> CreateSession([FromBody] Session session)
        // {
        //     if (session == null)
        //     {
        //         return BadRequest();
        //     }

        //     return Ok();
        // }
        // [HttpPost("UpdateSession")]
        // public async Task<ActionResult<Session>> UpdateSession([FromBody] Session session)
        // {
        //     if (session == null)
        //     {
        //         return BadRequest();
        //     }

        //     // This is a placeholder for the actual implementation.
        //     // You would typically update the session in a database or other data source.

        //     return Ok();
        // }
    }
}
