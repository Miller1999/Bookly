namespace BackCitas.Data;
using Microsoft.EntityFrameworkCore;
using BackCitas.Models;

public class AppointmentContext : DbContext
{
    public AppointmentContext(DbContextOptions<AppointmentContext> options) : base(options)
    {
        
    }
    
    public DbSet<Appointment> Appointments { get; set; }
}