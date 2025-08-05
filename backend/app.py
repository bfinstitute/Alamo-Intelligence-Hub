from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import json
import os
import tempfile
from werkzeug.utils import secure_filename
import io
import jwt
from datetime import datetime, timedelta
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'  # Change this in production
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}

# Mock user database (replace with real database in production)
USERS = {
    'admin@bfinstitute.org': {
        'password': 'admin123',
        'name': 'Admin User'
    },
    'user@bfinstitute.org': {
        'password': 'user123',
        'name': 'Regular User'
    }
}

# Configure Google Gemini API
GOOGLE_API_KEY = 'AIzaSyB65IMwrtbiJw2iWzV_sSFRTs7ci83mckM'
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_token(user_email):
    """Generate JWT token for user"""
    payload = {
        'email': user_email,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['email']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_column_descriptions(columns):
    """Get column descriptions from Google Gemini API"""
    try:
        # Create a much better prompt for Gemini
        prompt = f"""
        Analyze these CSV column names and provide meaningful descriptions:

        Columns: {', '.join(columns)}

        For each column, provide a clear, professional description of what the data likely represents.
        Focus on the business meaning and purpose of each field.

        Respond ONLY with a valid JSON object in this exact format:
        {{
            "column_name": "Description of what this column represents",
            "another_column": "Description of what this column represents"
        }}

        Examples of good descriptions:
        - "Latitude": "Geographic latitude coordinate for location mapping"
        - "PCI": "Pavement Condition Index - measures road surface quality (0-100 scale)"
        - "Maintenance_Age_Years": "Number of years since last road maintenance was performed"
        - "Pothole_Formation_Risk_Score": "Risk assessment score for pothole development likelihood"

        Make descriptions specific and informative, not generic.
        """
        
        # Get response from Gemini
        response = model.generate_content(prompt)
        
        print(f"Gemini raw response: {response.text}")
        
        # Parse JSON response
        try:
            descriptions = json.loads(response.text)
            return descriptions
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Raw response: {response.text}")
            # If JSON parsing fails, create intelligent descriptions
            descriptions = {}
            for column in columns:
                descriptions[column] = create_intelligent_description(column)
            return descriptions
            
    except Exception as e:
        print(f"Gemini API error: {str(e)}")
        # Fallback: create intelligent descriptions
        descriptions = {}
        for column in columns:
            descriptions[column] = create_intelligent_description(column)
        return descriptions

def create_intelligent_description(column_name):
    """Create intelligent descriptions based on column name patterns"""
    column_lower = column_name.lower()
    
    # Geographic coordinates
    if 'latitude' in column_lower:
        return "Geographic latitude coordinate for location mapping"
    elif 'longitude' in column_lower:
        return "Geographic longitude coordinate for location mapping"
    
    # Road maintenance and condition
    elif 'pci' in column_lower:
        return "Pavement Condition Index - measures road surface quality (0-100 scale)"
    elif 'maintenance' in column_lower and 'age' in column_lower:
        return "Number of years since last road maintenance was performed"
    elif 'deterioration' in column_lower:
        return "Assessment score indicating road surface deterioration level"
    elif 'pothole' in column_lower and 'risk' in column_lower:
        return "Risk assessment score for pothole development likelihood"
    
    # Complaints and issues
    elif 'complaint' in column_lower:
        return "Number of recent complaints or issues reported"
    
    # Scaling and normalization
    elif 'scaled' in column_lower:
        return "Normalized/scaled version of the original metric for analysis"
    
    # Color coding
    elif 'color' in column_lower:
        return "Color classification or coding for data visualization"
    
    # Unnamed columns
    elif 'unnamed' in column_lower:
        return "Auto-generated index column (no specific meaning)"
    
    # MSAG (Master Street Address Guide)
    elif 'msag' in column_lower:
        return "Master Street Address Guide name for location identification"
    
    # Default fallback
    else:
        return f"Data field: {column_name.replace('_', ' ').title()}"

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'CSV Analyzer Backend is running'})

@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user exists and password matches
        if email in USERS and USERS[email]['password'] == password:
            token = generate_token(email)
            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'email': email,
                    'name': USERS[email]['name']
                },
                'message': 'Login successful'
            })
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    
    except Exception as e:
        return jsonify({'error': f'Login error: {str(e)}'}), 500

@app.route('/api/verify-token', methods=['POST'])
def verify_token_endpoint():
    """Verify JWT token endpoint"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token is required'}), 400
        
        email = verify_token(token)
        if email:
            return jsonify({
                'success': True,
                'user': {
                    'email': email,
                    'name': USERS.get(email, {}).get('name', 'Unknown User')
                }
            })
        else:
            return jsonify({'error': 'Invalid or expired token'}), 401
    
    except Exception as e:
        return jsonify({'error': f'Token verification error: {str(e)}'}), 500

@app.route('/api/files', methods=['GET'])
def list_uploaded_files():
    """List all uploaded CSV files"""
    try:
        if not os.path.exists(UPLOAD_FOLDER):
            return jsonify({'files': []})
        
        files = []
        for filename in os.listdir(UPLOAD_FOLDER):
            if filename.endswith('.csv'):
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file_stat = os.stat(file_path)
                files.append({
                    'filename': filename,
                    'size': file_stat.st_size,
                    'uploaded_at': datetime.fromtimestamp(file_stat.st_mtime).isoformat(),
                    'path': file_path
                })
        
        return jsonify({
            'success': True,
            'files': files
        })
    
    except Exception as e:
        return jsonify({'error': f'Error listing files: {str(e)}'}), 500

@app.route('/api/files/<filename>', methods=['GET'])
def get_file_info(filename):
    """Get information about a specific uploaded file"""
    try:
        file_path = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        
        # Read and analyze the file
        df = pd.read_csv(file_path)
        file_stat = os.stat(file_path)
        
        info = {
            'filename': filename,
            'size': file_stat.st_size,
            'uploaded_at': datetime.fromtimestamp(file_stat.st_mtime).isoformat(),
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'columns': list(df.columns),
            'data_types': df.dtypes.astype(str).to_dict(),
            'missing_values': df.isnull().sum().to_dict()
        }
        
        return jsonify({
            'success': True,
            'file_info': info
        })
    
    except Exception as e:
        return jsonify({'error': f'Error getting file info: {str(e)}'}), 500

@app.route('/api/upload', methods=['POST'])
def upload_csv():
    """Upload and parse CSV file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload a CSV file.'}), 400
        
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Save file to uploads folder
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # Read CSV file from saved location
        try:
            df = pd.read_csv(file_path)
        except Exception as e:
            return jsonify({'error': f'Error reading CSV file: {str(e)}'}), 400
        
        # Convert to JSON for frontend
        csv_data = df.to_dict('records')
        
        # Get column descriptions from Gemini API
        column_descriptions = get_column_descriptions(list(df.columns))
        
        # Get basic statistics
        stats = {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'columns': list(df.columns),
            'data_types': df.dtypes.astype(str).to_dict(),
            'missing_values': df.isnull().sum().to_dict(),
            'file_path': file_path,
            'column_descriptions': column_descriptions
        }
        
        return jsonify({
            'success': True,
            'data': csv_data,
            'stats': stats,
            'filename': filename,
            'saved_path': file_path,
            'column_descriptions': column_descriptions
        })
    
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_csv():
    """Analyze CSV data and provide insights"""
    try:
        data = request.get_json()
        csv_data = data.get('csvData', [])
        
        if not csv_data:
            return jsonify({'error': 'No CSV data provided'}), 400
        
        df = pd.DataFrame(csv_data)
        
        # Basic analysis
        analysis = {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'columns': list(df.columns),
            'data_types': df.dtypes.astype(str).to_dict(),
            'missing_values': df.isnull().sum().to_dict(),
            'duplicate_rows': df.duplicated().sum(),
            'memory_usage': df.memory_usage(deep=True).sum()
        }
        
        # Column-specific analysis
        column_analysis = {}
        for column in df.columns:
            col_data = df[column]
            col_analysis = {
                'data_type': str(col_data.dtype),
                'missing_count': col_data.isnull().sum(),
                'unique_count': col_data.nunique()
            }
            
            # Numeric column analysis
            if pd.api.types.is_numeric_dtype(col_data):
                col_analysis.update({
                    'min': float(col_data.min()) if not col_data.isnull().all() else None,
                    'max': float(col_data.max()) if not col_data.isnull().all() else None,
                    'mean': float(col_data.mean()) if not col_data.isnull().all() else None,
                    'median': float(col_data.median()) if not col_data.isnull().all() else None,
                    'std': float(col_data.std()) if not col_data.isnull().all() else None
                })
            
            # String column analysis
            elif pd.api.types.is_string_dtype(col_data):
                col_analysis.update({
                    'min_length': int(col_data.str.len().min()) if not col_data.isnull().all() else None,
                    'max_length': int(col_data.str.len().max()) if not col_data.isnull().all() else None,
                    'avg_length': float(col_data.str.len().mean()) if not col_data.isnull().all() else None
                })
            
            column_analysis[column] = col_analysis
        
        analysis['column_analysis'] = column_analysis
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
    
    except Exception as e:
        return jsonify({'error': f'Analysis error: {str(e)}'}), 500

@app.route('/api/download', methods=['POST'])
def download_csv():
    """Download processed CSV file"""
    try:
        data = request.get_json()
        csv_data = data.get('csvData', [])
        filename = data.get('filename', 'processed_data.csv')
        
        if not csv_data:
            return jsonify({'error': 'No CSV data provided'}), 400
        
        df = pd.DataFrame(csv_data)
        
        # Save processed file to uploads folder with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        processed_filename = f"processed_{timestamp}_{filename}"
        processed_file_path = os.path.join(UPLOAD_FOLDER, processed_filename)
        df.to_csv(processed_file_path, index=False)
        
        # Create CSV in memory for download
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)
        
        # Create response
        response = app.response_class(
            csv_buffer.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': f'attachment; filename={processed_filename}'}
        )
        
        return response
    
    except Exception as e:
        return jsonify({'error': f'Download error: {str(e)}'}), 500

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    """Submit user feedback about CSV"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['purpose', 'stakeholders', 'incorrectFields', 'terminology', 'additionalContext']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Here you would typically save to database
        # For now, we'll just log and return success
        print("Feedback received:", data)
        
        return jsonify({
            'success': True,
            'message': 'Feedback submitted successfully'
        })
    
    except Exception as e:
        return jsonify({'error': f'Feedback submission error: {str(e)}'}), 500

@app.route('/api/validate', methods=['POST'])
def validate_csv():
    """Validate CSV data for common issues"""
    try:
        data = request.get_json()
        csv_data = data.get('csvData', [])
        
        if not csv_data:
            return jsonify({'error': 'No CSV data provided'}), 400
        
        df = pd.DataFrame(csv_data)
        
        validation_results = {
            'has_duplicates': df.duplicated().any(),
            'has_missing_values': df.isnull().any().any(),
            'empty_columns': df.columns[df.isnull().all()].tolist(),
            'potential_issues': []
        }
        
        # Check for potential issues
        for column in df.columns:
            col_data = df[column]
            
            # Check for mixed data types in string columns
            if pd.api.types.is_string_dtype(col_data):
                # Check if there are numeric values in string columns
                numeric_count = pd.to_numeric(col_data, errors='coerce').notna().sum()
                if numeric_count > 0 and numeric_count < len(col_data):
                    validation_results['potential_issues'].append({
                        'column': column,
                        'issue': 'Mixed data types detected',
                        'description': f'Column contains both text and numeric values'
                    })
            
            # Check for unusually long strings
            if pd.api.types.is_string_dtype(col_data):
                max_length = col_data.str.len().max()
                if max_length > 1000:
                    validation_results['potential_issues'].append({
                        'column': column,
                        'issue': 'Very long text detected',
                        'description': f'Maximum length: {max_length} characters'
                    })
        
        return jsonify({
            'success': True,
            'validation': validation_results
        })
    
    except Exception as e:
        return jsonify({'error': f'Validation error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 