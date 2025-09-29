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
			const formattedDate = new Date(date).toISOString(); // convierte al formato ISO correcto
			await postAppointment({ clientName, date: formattedDate, status });
			setMessage("Cita creada exitosamente");
			// Refresh appointments
			const response = await api.get("/appointments");
			setAppointments(response.data);

			// Reset form
			setClientName("");
			setDate("");
			setStatus("pendiente");
			setShowForm(false);
		} catch (error) {
			console.error("Error creating appointment:", error);
			setMessage("Error al crear la cita");
		}
	};
	if (error) return <p className="text-red-600">{error}</p>;
	else if (loading) {
		return (
			<>
				<h1 className="text-3xl">Sistema de citas</h1>
				<Loading />
			</>
		);
	} else if (appointments.length === 0) {
		return (
			<>
				<h1 className="text-3xl">Sistema de citas</h1>
				<p>No hay citas disponibles.</p>
			</>
		);
	} else {
		return (
			<>
				<h1 className="text-3xl text-blue-700">Sistema de citas</h1>
				<ul>
					{appointments.map((appointment) => (
						<li key={appointment.id}>
							{appointment.clientName} - {formatDate(appointment.date)} -
							{appointment.status}
						</li>
					))}
				</ul>
				<button
					className="p-2 rounded-lg bg-blue-700 text-white"
					onClick={() => {
						setShowForm(true);
					}}
				>
					Nueva cita
				</button>
				{message && <p className="text-green-600">{message}</p>}
				{showForm && (
					<form onSubmit={handleSubmit}>
						<h2 className="text-2xl mb-4">Nueva Cita</h2>
						<div className="mb-4">
							<label className="block text-gray-700">Nombre del Cliente:</label>
							<input
								type="text"
								value={clientName}
								onChange={(e) => setClientName(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded mt-1"
								required
							/>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">Fecha y Hora:</label>
							<input
								type="datetime-local"
								value={date}
								min={new Date().toISOString().slice(0, 16)}
								onChange={(e) => setDate(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded mt-1"
								required
							/>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">Estado:</label>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded mt-1"
							>
								<option value="pendiente">Pendiente</option>
								<option value="confirmada">Confirmada</option>
								<option value="cancelada">Cancelada</option>
							</select>
						</div>
						<button
							type="submit"
							className="p-2 rounded-lg bg-blue-700 text-white"
						>
							Guardar Cita
						</button>
					</form>
				)}
			</>
		);
	}
}

export default App;
