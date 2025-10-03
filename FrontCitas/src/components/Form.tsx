import api, { postAppointment } from "../services/api";

interface FormProps {
	setMessage: React.Dispatch<React.SetStateAction<string>>;
	setAppointments: React.Dispatch<React.SetStateAction<any[]>>;
	setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
	editingId: number | null;
	setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
	clientName: string;
	setClientName: React.Dispatch<React.SetStateAction<string>>;
	date: string;
	setDate: React.Dispatch<React.SetStateAction<string>>;
	status: string;
	setStatus: React.Dispatch<React.SetStateAction<string>>;
}

export function Form({
	setMessage,
	setAppointments,
	setShowForm,
	editingId,
	setEditingId,
	clientName,
	setClientName,
	date,
	setDate,
	status,
	setStatus,
}: FormProps) {
	const getLocalDateTime = () => {
		const now = new Date();
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
		return now.toISOString().slice(0, 16);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const formattedDate = new Date(date).toISOString();

			if (editingId) {
				await api.put(`/appointments/${editingId}`, {
					id: editingId,
					clientName,
					date: formattedDate,
					status,
				});
				setMessage("Cita actualizada exitosamente");
			} else {
				await postAppointment({ clientName, date: formattedDate, status });
				setMessage("Cita creada exitosamente");
			}

			const response = await api.get("/appointments");
			setAppointments(response.data);

			// Reset form
			setClientName("");
			setDate("");
			setStatus("pendiente");
			setEditingId(null);
			setShowForm(false);
		} catch (error) {
			console.error("Error saving appointment:", error);
			setMessage("Error al guardar la cita");
		}
	};

	return (
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
				<select value={status} onChange={(e) => setStatus(e.target.value)}>
					<option value="pendiente">Pendiente</option>
					<option value="confirmada">Confirmada</option>
					<option value="cancelada">Cancelada</option>
				</select>
			</div>
			<button type="submit" className="btn-primary">
				Guardar Cita
			</button>
		</form>
	);
}
