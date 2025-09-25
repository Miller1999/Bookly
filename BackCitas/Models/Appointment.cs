namespace BackCitas.Models;

public class Appointment
{
    public int Id { get; set; }
    public string ClientName { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; }
}