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

export const putAppointment = async (
	id: number,
	appointment: Omit<Appointment, "id">
) => {
	return api.put<Appointment>(`/appointments/${id}`, appointment);
};

export const deleteAppointment = async (id: number) => {
	return api.delete(`/appointments/${id}`);
};

export default api;
