import axios from "axios";

interface Appointment {
	id: number;
	clientName: string;
	date: string;
	status: string;
}

const api = axios.create({
	baseURL: "http://localhost:5223/api",
	timeout: 10000,
});

export const postAppointment = async (appointment: Omit<Appointment, "id">) => {
	return api.post<Appointment>("/appointments", appointment);
};

export default api;
