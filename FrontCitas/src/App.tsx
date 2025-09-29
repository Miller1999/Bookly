import { useEffect, useState } from "react";
import api, { postAppointment } from "./services/api";
import "./style.css";
import Loading from "./components/Loading";

interface Appointment {
	id: number;
	clientName: string;
	date: string;
	status: string;
}

function App() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [clientName, setClientName] = useState("");
	const [date, setDate] = useState("");
	const [status, setStatus] = useState("pendiente");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);

	useEffect(() => {
		api
			.get("/appointments")
			.then((response) => {
				setAppointments(response.data);
				setLoading(false);
			})
			.catch(() => setError("Error al cargar las citas"))
			.finally(() => setLoading(false));
	}, []);

	const getLocalDateTime = () => {
		const now = new Date();
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Ajusta a hora local
		return now.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm (formato válido para datetime-local)
	};

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const formattedDate = new Date(date).toISOString();

			if (editingId) {
				// ✅ Modo edición → PUT
				await api.put(`/appointments/${editingId}`, {
					id: editingId,
					clientName,
					date: formattedDate,
					status,
				});
				setMessage("Cita actualizada exitosamente");
			} else {
				// ✅ Modo creación → POST
				await postAppointment({ clientName, date: formattedDate, status });
				setMessage("Cita creada exitosamente");
			}

			// Refresh
			const response = await api.get("/appointments");
			setAppointments(response.data);

			// Reset form
			setClientName("");
			setDate("");
			setStatus("pendiente");
			setEditingId(null); // ✅ Reset al terminar
			setShowForm(false);
		} catch (error) {
			console.error("Error saving appointment:", error);
			setMessage("Error al guardar la cita");
		}
	};

	const handleEdit = (id: number) => {
		try {
			const appointmentToEdit = appointments.find((app) => app.id === id);
			if (appointmentToEdit) {
				setClientName(appointmentToEdit.clientName);
				setDate(appointmentToEdit.date.slice(0, 16)); // Ajuste para datetime-local
				setStatus(appointmentToEdit.status);
				setEditingId(appointmentToEdit.id); // ✅ Guardar id de la cita a editar
				setShowForm(true);
			}
		} catch (error) {
			console.error("Error editing appointment:", error);
			setMessage("Error al editar la cita");
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await api.delete(`/appointments/${id}`);
			setMessage("Cita eliminada exitosamente");
			// Refresh appointments
			const response = await api.get("/appointments");
			setAppointments(response.data);
		} catch (error) {
			console.error("Error deleting appointment:", error);
			setMessage("Error al eliminar la cita");
		}
	};

	if (error)
		return (
			<div className="app-container">
				<p className="message-error">{error}</p>
			</div>
		);
	else if (loading) {
		return (
			<div className="app-container">
				<h1>Sistema de citas</h1>
				<Loading />
			</div>
		);
	} else if (appointments.length === 0) {
		return (
			<div className="app-container">
				<h1>Sistema de citas</h1>
				<p>No hay citas disponibles.</p>
			</div>
		);
	} else {
		return (
			<div className="app-container">
				<h1>Sistema de citas</h1>
				<ul>
					{appointments.map((appointment) => (
						<li key={appointment.id} className="appointment-item">
							<div className="appointment-info">
								<span className="appointment-name">
									{appointment.clientName}
								</span>
								<span className="appointment-date">
									{formatDate(appointment.date)}
								</span>
								<span
									className={`status-badge ${
										appointment.status === "cancelada"
											? "canceled"
											: appointment.status === "confirmada"
											? "confirmed"
											: "pending"
									}`}
								>
									{appointment.status === "cancelada"
										? "❌ Cancelada"
										: appointment.status === "confirmada"
										? "✅ Confirmada"
										: "⏳ Pendiente"}
								</span>
							</div>
							<div className="appointment-actions">
								<button
									className="btn-secondary"
									onClick={() => {
										handleEdit(appointment.id);
									}}
								>
									Editar
								</button>
								<button
									className="btn-danger"
									onClick={() => {
										handleDelete(appointment.id);
									}}
								>
									Eliminar
								</button>
							</div>
						</li>
					))}
				</ul>
				<button
					className="btn-primary"
					onClick={() => {
						setShowForm(true);
					}}
				>
					Nueva cita
				</button>
				{message && (
					<p
						className={`message ${
							message.includes("Error") ? "message-error" : "message-success"
						}`}
					>
						{message}
					</p>
				)}
				{showForm && (
					<form onSubmit={handleSubmit}>
						<h2>{editingId ? "Editar Cita" : "Nueva Cita"}</h2>
						<div className="form-group">
							<label>Nombre del Cliente:</label>
							<input
								type="text"
								value={clientName}
								onChange={(e) => setClientName(e.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<label>Fecha y Hora:</label>
							<input
								type="datetime-local"
								value={date}
								min={getLocalDateTime()}
								onChange={(e) => setDate(e.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<label>Estado:</label>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
							>
								<option value="pendiente">Pendiente</option>
								<option value="confirmada">Confirmada</option>
								<option value="cancelada">Cancelada</option>
							</select>
						</div>
						<button type="submit" className="btn-primary">
							Guardar Cita
						</button>
					</form>
				)}
			</div>
		);
	}
}

export default App;
