using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackCitas.Models;
using BackCitas.Data;

namespace BackCitas.Controllers;

[Route("api/appointments")]
[ApiController]

public class AppointmentController : ControllerBase
{
    private readonly AppointmentContext _context;
    
    public AppointmentController(AppointmentContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Appointment>>> Get()
    {
        return Ok(await _context.Appointments.ToListAsync());
    }
}