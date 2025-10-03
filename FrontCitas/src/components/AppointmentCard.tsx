const AppointmentCard = ({ appointment, handleEdit, handleDelete }) => {
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
	return (
		<li key={appointment.id} className="appointment-item">
			<div className="appointment-info">
				<span className="appointment-name">{appointment.clientName}</span>
				<span className="appointment-date">{formatDate(appointment.date)}</span>
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
	);
};

export default AppointmentCard;
