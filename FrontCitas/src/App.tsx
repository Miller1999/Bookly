import { useEffect, useState } from "react";
import api from "./services/api";
import "./style.css";
import Loading from "./components/Loading";
import { Form } from "./components/Form";
import AppointmentCard from "./components/AppointmentCard";

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
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [clientName, setClientName] = useState("");
	const [date, setDate] = useState("");
	const [status, setStatus] = useState("pendiente");
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

	const handleEdit = (id: number) => {
		try {
			const appointmentToEdit = appointments.find((app) => app.id === id);
			if (appointmentToEdit) {
				setClientName(appointmentToEdit.clientName);
				setDate(appointmentToEdit.date); // Ajuste para datetime-local
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
						<AppointmentCard
							appointment={appointment}
							key={appointment.id}
							handleEdit={handleEdit}
							handleDelete={handleDelete}
						/>
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
					<Form
						setMessage={setMessage}
						setAppointments={setAppointments}
						setShowForm={setShowForm}
						editingId={editingId}
						setEditingId={setEditingId}
						clientName={clientName}
						setClientName={setClientName}
						date={date}
						setDate={setDate}
						status={status}
						setStatus={setStatus}
					/>
				)}
			</div>
		);
	}
}

export default App;
