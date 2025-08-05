import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key
GEMINI_API_KEY = os.getenv('GOOGLE_API_KEY', '')
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

print("=== Gemini API Test with Real Column Names ===")
print(f"API Key available: {bool(GEMINI_API_KEY)}")
print(f"API Key length: {len(GEMINI_API_KEY) if GEMINI_API_KEY else 0}")
if GEMINI_API_KEY:
    print(f"API Key starts with: {GEMINI_API_KEY[:10]}...")

if not GEMINI_API_KEY:
    print("❌ No API key found!")
    exit(1)

# Test with the actual column names from your CSV
columns_list = [
    "CartID", "Comments", "District", "FromStreet", "GlobalID", "GoogleMapView", 
    "Historical_ID", "InstallDate", "Jurisdiction", "LengthFeet", "MSAG_Name", 
    "MaintenanceResponsibility", "OBJECTID", "OneWay", "Owner", "PCI", 
    "PavementWidth", "ProjectName", "ROAD_CLASSIFICATION", "ROW_Type", 
    "RoadFunction", "Shape_Length", "SpeedLimit", "Stage", "Status", 
    "Surface_Type", "SweepingSchedule", "ToStreet", "VendorComments", 
    "VendorProjectName", "created_date", "created_user", "last_edited_date", 
    "last_edited_user"
]

# Sample data for context
sample_data = [
    {
        "CartID": 307451,
        "Comments": "Field Calculated Length per Otto 5/3/23",
        "District": "10",
        "FromStreet": "ELM PARK DR",
        "GlobalID": "{BD6999B8-9F82-434B-A636-C82C4ACEE7BB}",
        "GoogleMapView": "http://www.google.com/maps/place/29.58229225N 098.42891563W",
        "Historical_ID": 307451.0,
        "InstallDate": "1980-01-01",
        "Jurisdiction": "San Antonio",
        "LengthFeet": 1375.565913,
        "MSAG_Name": "TRIPLE CRK",
        "MaintenanceResponsibility": "COSA - Public Works Dept",
        "OBJECTID": 4,
        "OneWay": "No",
        "Owner": "San Antonio",
        "PCI": 92.7,
        "PavementWidth": 30.0,
        "ProjectName": "Unknown",
        "ROAD_CLASSIFICATION": 1,
        "ROW_Type": "Street",
        "RoadFunction": "Local",
        "Shape_Length": 1375.565913,
        "SpeedLimit": 0,
        "Stage": "Existing",
        "Status": "TBD",
        "Surface_Type": "AC Asphalt Concrete",
        "SweepingSchedule": "Schedule1",
        "ToStreet": "TRAILWAY PARK",
        "VendorComments": None,
        "VendorProjectName": None,
        "created_date": "2022-11-29 19:58:50",
        "created_user": "OTTO",
        "last_edited_date": "2024-06-23 7:15:08",
        "last_edited_user": "OTTO"
    }
]

sample_text = "\n".join([f"Row {i+1}: {json.dumps(row)}" for i, row in enumerate(sample_data)])

# Create prompt for all columns at once
prompt = f"""
You are a data expert. The following CSV file has these column headers:

{', '.join(columns_list)}

Here are a few sample rows:

{sample_text}

Please analyze the column names and give a description of what each one likely refers to or means.
Output your answer as a JSON object where keys are column names and values are descriptions.
Example format: {{"column1": "description1", "column2": "description2"}}

Only return the JSON object, no other text.
"""

try:
    headers = {
        'Content-Type': 'application/json',
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }
    
    print(f"\nTesting API call to: {GEMINI_URL}")
    print(f"Testing with {len(columns_list)} column names...")
    
    response = requests.post(
        f"{GEMINI_URL}?key={GEMINI_API_KEY}",
        headers=headers,
        json=data,
        timeout=30
    )
    
    print(f"Response status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        if 'candidates' in result and len(result['candidates']) > 0:
            ai_response = result['candidates'][0]['content']['parts'][0]['text']
            print(f"✅ API Response received!")
            print(f"Response length: {len(ai_response)} characters")
            print(f"First 200 chars: {ai_response[:200]}...")
            
            # Try to parse as JSON
            try:
                ai_annotations = json.loads(ai_response)
                print(f"✅ Successfully parsed JSON response!")
                print(f"Number of column descriptions: {len(ai_annotations)}")
                
                # Show a few examples
                print("\nSample descriptions:")
                for i, (col, desc) in enumerate(ai_annotations.items()):
                    if i < 5:  # Show first 5
                        print(f"  {col}: {desc}")
                    else:
                        break
                if len(ai_annotations) > 5:
                    print(f"  ... and {len(ai_annotations) - 5} more")
                    
            except json.JSONDecodeError as e:
                print(f"❌ JSON parsing failed: {e}")
                print(f"Raw response: {ai_response}")
                
        else:
            print("❌ No candidates in response")
            print(f"Response: {result}")
    else:
        print(f"❌ API Error: {response.status_code}")
        print(f"Error response: {response.text}")
        
except Exception as e:
    print(f"❌ Exception occurred: {str(e)}") 