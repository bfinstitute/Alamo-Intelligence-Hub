# CSV Analyzer

A full-stack web application for analyzing and processing CSV files with a modern React frontend and Flask backend.

## Project Structure

```
csvAnalyzer-frontend/
├── backend/          # Flask backend API
│   ├── app.py        # Main Flask application
│   ├── requirements.txt
│   └── README.md
└── frontend/         # React frontend application
    ├── src/
    ├── public/
    ├── package.json
    └── README.md
```

## Features

### Frontend (React)
- **Modern UI**: Clean, responsive design with drag-and-drop file upload
- **CSV Preview**: Interactive table view with column descriptions
- **Progress Tracking**: Multi-step workflow with progress indicators
- **Real-time Validation**: Client-side file validation
- **Download Functionality**: Export processed CSV files

### Backend (Flask)
- **File Upload**: Secure CSV file upload with validation
- **Data Analysis**: Comprehensive CSV analysis and statistics
- **Data Processing**: Advanced data manipulation capabilities
- **API Endpoints**: RESTful API for all operations
- **Error Handling**: Robust error handling and validation

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask server:**
   ```bash
   python app.py
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## API Endpoints

### Backend API (http://localhost:5000/api)

- `GET /health` - Health check
- `POST /upload` - Upload CSV file
- `POST /analyze` - Analyze CSV data
- `POST /download` - Download processed CSV
- `POST /validate` - Validate CSV data
- `POST /feedback` - Submit user feedback

## Development

### Backend Development
- The Flask app runs in debug mode by default
- Auto-reload is enabled for development
- Check `backend/README.md` for detailed backend documentation

### Frontend Development
- React development server with hot reload
- Uses React Router for navigation
- Context API for state management
- Check `frontend/README.md` for detailed frontend documentation

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend
```
FLASK_ENV=development
FLASK_DEBUG=1
```

## File Upload Limits

- Maximum file size: 16MB
- Supported formats: CSV only
- Automatic file validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

This project is licensed under the MIT License. 