using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PumpLogApi.Entities;
using PumpLogApi.Managers;
using PumpLogApi.Models;

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
        public async Task<ActionResult<Session>> SaveSession([FromBody] SessionRequest session)
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

        [HttpPost("SaveSection")]
        public async Task<ActionResult> SaveSection([FromBody] SectionRequest request)
        {
            try
            {
                var savedSection = await _pumpLogManager.SaveSection(request);
                return Ok(savedSection);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while saving the section" });
            }
        }

        [HttpDelete("DeleteSection/{sectionGuid}")]
        public async Task<ActionResult> DeleteSection(Guid sectionGuid)
        {
            try
            {
                var result = await _pumpLogManager.DeleteSection(sectionGuid);
                if (!result)
                {
                    return NotFound(new { message = "Section not found" });
                }
                return Ok(new { message = "Section deleted successfully" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the section" });
            }
        }

        [HttpGet("Exercises")]
        public async Task<ActionResult<IEnumerable<Exercise>>> GetExercises()
        {
            var exercises = await _pumpLogManager.GetAllExercises();
            return Ok(exercises);
        }

        [HttpPost("Exercise")]
        public async Task<ActionResult<Exercise>> CreateExercise([FromBody] Exercise exercise)
        {
            var createdExercise = await _pumpLogManager.CreateExercise(exercise);
            return CreatedAtAction(nameof(GetExercises), new { id = createdExercise.ExerciseGuid }, createdExercise);
        }

        [HttpGet("BodyParts")]
        public async Task<ActionResult<IEnumerable<BodyPart>>> GetBodyParts()
        {
            var bodyParts = await _pumpLogManager.GetAllBodyParts();
            return Ok(bodyParts);
        }

        [HttpPost("FinishWorkout/{sessionGuid}")]
        public async Task<ActionResult<Session>> FinishWorkout(Guid sessionGuid)
        {
            try
            {
                var newSession = await _pumpLogManager.FinishWorkout(sessionGuid);
                return Ok(newSession);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while finishing the workout" });
            }
        }
    }
}
