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

    [HttpGet("{id}")]
    public async Task<ActionResult<Appointment>> GetById(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null) return NotFound();
        return Ok(appointment);
    }

// POST: api/appointments
    [HttpPost]
    public async Task<ActionResult<Appointment>> Create(Appointment appointment)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, appointment);
    }

// PUT: api/appointments/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Appointment appointment)
    {
        if (id != appointment.Id) return BadRequest();
        _context.Entry(appointment).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

// DELETE: api/appointments/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null) return NotFound();

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}