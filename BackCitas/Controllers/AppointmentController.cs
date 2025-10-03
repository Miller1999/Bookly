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
    public async Task<ActionResult<IEnumerable<Appointment>>> Get(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 10;
        if (pageSize > 50) pageSize = 50;
        
        var appointments = await _context.Appointments.OrderBy(a => a.Date).Skip((page-1) * pageSize).Take(pageSize).ToListAsync();
        return Ok(appointments);
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
    public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
    {
        // Validar clientName
        if (string.IsNullOrWhiteSpace(appointment.ClientName))
            return BadRequest("El nombre del cliente es obligatorio.");

        // Validar fecha futura
        if (appointment.Date <= DateTime.Now)
            return BadRequest("La fecha de la cita debe ser futura.");

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = appointment.Id }, appointment);
    }

// PUT: api/appointments/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAppointment(int id, Appointment appointment)
    {
        if (id != appointment.Id)
            return BadRequest("El ID no coincide.");

        if (string.IsNullOrWhiteSpace(appointment.ClientName))
            return BadRequest("El nombre del cliente es obligatorio.");

        if (appointment.Date <= DateTime.Now)
            return BadRequest("La fecha de la cita debe ser futura.");

        // 🔹 Actualizar la fecha de modificación
        appointment.UpdatedAt = DateTime.Now;

        _context.Entry(appointment).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Appointments.Any(e => e.Id == id))
                return NotFound();

            throw;
        }

        return NoContent();
    }

// DELETE: api/appointments/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAppointment(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);

        if (appointment == null)
            return NotFound();

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}