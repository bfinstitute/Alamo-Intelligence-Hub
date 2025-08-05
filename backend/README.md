# CSV Analyzer Backend

A Flask-based backend API for the CSV Analyzer application.

## Features

- **CSV Upload & Parsing**: Upload and parse CSV files with validation
- **CSV Analysis**: Comprehensive data analysis including statistics and insights
- **CSV Download**: Download processed CSV files
- **Data Validation**: Check for common data quality issues
- **Feedback Collection**: Collect and store user feedback

## API Endpoints

### Health Check
- `GET /api/health` - Check if the backend is running

### CSV Operations
- `POST /api/upload` - Upload and parse CSV file
- `POST /api/analyze` - Analyze CSV data and provide insights
- `POST /api/download` - Download processed CSV file
- `POST /api/validate` - Validate CSV data for common issues

### Feedback
- `POST /api/feedback` - Submit user feedback about CSV

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Flask application:**
   ```bash
   python app.py
   ```

3. **Access the API:**
   - Backend will be available at `http://localhost:5000`
   - API endpoints are prefixed with `/api`

## Environment Variables

- `FLASK_ENV`: Set to `development` for debug mode
- `FLASK_DEBUG`: Set to `1` to enable debug mode

## File Upload Limits

- Maximum file size: 16MB
- Supported formats: CSV only

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in JSON format:

```json
{
  "error": "Error description"
}
```

## Development

To run in development mode with auto-reload:

```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py
```

## Dependencies

- Flask 3.0.0
- Flask-CORS 4.0.0
- pandas 2.1.4
- numpy 1.24.3
- python-dotenv 1.0.0
- Werkzeug 3.0.1 