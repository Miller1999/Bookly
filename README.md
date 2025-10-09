# API Citas

A full-stack appointment management system built with ASP.NET Core for the backend API and React with TypeScript for the frontend. This application allows users to create, view, update, and delete appointments with validation and a user-friendly interface.

## Features

- **CRUD Operations**: Create, read, update, and delete appointments
- **Validation**: Client-side and server-side validation for appointment data
- **Pagination**: Paginated list of appointments for better performance
- **Status Management**: Appointments can have statuses: pendiente (pending), confirmada (confirmed), cancelada (canceled)
- **Responsive UI**: Modern, responsive interface built with Tailwind CSS
- **API Documentation**: Swagger UI for exploring and testing the API endpoints
- **Database Integration**: Uses PostgreSQL with Entity Framework Core

## Tech Stack

### Backend

- **ASP.NET Core 8**: Web API framework
- **Entity Framework Core**: ORM for database operations
- **PostgreSQL**: Database
- **Swagger/OpenAPI**: API documentation

### Frontend

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls

## Prerequisites

Before running this application, make sure you have the following installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (version 12 or higher)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Miller1999/Bookly
   cd "API citas"
   ```

2. **Set up the database:**

   - Install and start PostgreSQL
   - Create a database named `appointmentsdb`
   - Create a user `api_user` with password `1234` (or update the connection string in `BackCitas/appsettings.json`)

3. **Backend setup:**

   ```bash
   cd BackCitas
   dotnet restore
   dotnet ef database update  # Apply migrations
   ```

4. **Frontend setup:**
   ```bash
   cd ../FrontCitas
   npm install
   ```

## Usage

1. **Start the backend:**

   ```bash
   cd BackCitas
   dotnet run
   ```

   The API will be available at `http://localhost:5223` with Swagger UI at `http://localhost:5223/swagger`

2. **Start the frontend:**

   ```bash
   cd ../FrontCitas
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

3. **Access the application:**
   - Open your browser and navigate to `http://localhost:5173`
   - Use the interface to manage appointments

## Demo

![Sistema de citas](/assets/image.png)

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/appointments` - Get all appointments (paginated)
- `GET /api/appointments/{id}` - Get appointment by ID
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/{id}` - Update an existing appointment
- `DELETE /api/appointments/{id}` - Delete an appointment

### Request/Response Examples

**Create Appointment:**

```json
POST /api/appointments
{
  "clientName": "John Doe",
  "date": "2024-12-01T10:00:00",
  "status": "pendiente"
}
```

**Response:**

```json
{
	"id": 1,
	"clientName": "John Doe",
	"date": "2024-12-01T10:00:00",
	"status": "pendiente",
	"createdAt": "2024-10-03T12:00:00",
	"updatedAt": "2024-10-03T12:00:00"
}
```

## Project Structure

```
API citas/
├── BackCitas/                 # ASP.NET Core backend
│   ├── Controllers/           # API controllers
│   ├── Models/                # Data models
│   ├── Data/                  # Database context
│   ├── Migrations/            # EF Core migrations
│   └── appsettings.json       # Configuration
├── FrontCitas/                # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API service layer
│   │   └── App.tsx            # Main app component
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Frontend-specific setup (Vite template)
└── README.md                  # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
