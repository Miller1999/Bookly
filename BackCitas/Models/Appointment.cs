namespace BackCitas.Models;
using System.ComponentModel.DataAnnotations;

public class Appointment
{
    public int Id { get; set; }
    [Required(ErrorMessage = "El nombre es obligatorio")]
    public string ClientName { get; set; }
    
    [Required(ErrorMessage = "La fecha es obligatoria")]
    public DateTime Date { get; set; }
    
    [Required(ErrorMessage = "El estado es obligatorio")]
    [RegularExpression("pendiente|confirmada|cancelada", ErrorMessage = "Estado invalido")]
    public string Status { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; }
}