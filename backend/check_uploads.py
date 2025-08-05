#!/usr/bin/env python3
"""
Simple script to check the uploads folder and list uploaded files
"""

import os
import json
from datetime import datetime

UPLOAD_FOLDER = 'uploads'

def check_uploads():
    """Check and list all files in the uploads folder"""
    print("=== CSV Analyzer Uploads Folder Check ===")
    print()
    
    if not os.path.exists(UPLOAD_FOLDER):
        print(f"Uploads folder '{UPLOAD_FOLDER}' does not exist.")
        print("It will be created automatically when the first file is uploaded.")
        return
    
    files = os.listdir(UPLOAD_FOLDER)
    csv_files = [f for f in files if f.endswith('.csv')]
    
    if not csv_files:
        print("No CSV files found in uploads folder.")
        return
    
    print(f"Found {len(csv_files)} CSV file(s) in uploads folder:")
    print()
    
    for i, filename in enumerate(csv_files, 1):
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file_stat = os.stat(file_path)
        size_mb = file_stat.st_size / (1024 * 1024)
        modified_time = datetime.fromtimestamp(file_stat.st_mtime)
        
        print(f"{i}. {filename}")
        print(f"   Size: {size_mb:.2f} MB")
        print(f"   Modified: {modified_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"   Path: {file_path}")
        print()

if __name__ == "__main__":
    check_uploads() 