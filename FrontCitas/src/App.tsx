import { useEffect, useState } from "react";
import api from "./services/api";

interface Appointment {
	id: number;
	clientName: string;
	date: string;
	status: string;
}

function App() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	useEffect(() => {
		api.get("/appointments").then((response) => {
			setAppointments(response.data);
			console.log(response.data);
		});
	}, []);

	return (
		<>
			<h1>Sistema de citas</h1>
			<ul>
				{appointments.map((appointment) => (
					<li key={appointment.id}>
						{appointment.clientName} - {appointment.date} - {appointment.status}
					</li>
				))}
			</ul>
		</>
	);
}

export default App;
