import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UploadPage.css';
import { useCsv } from '../context/CsvContext';
import Header from './Header';
import uploadLogo from '../assets/images/iconoir_cloud-upload.svg'
import ProgressDots from './ProgressDots';
import UploadInfo from './UploadInfo';
import apiService from '../services/api';

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { setCsvData, setFileName, setCsvStats, setColumnDescriptions, fileName, csvData } = useCsv();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (file) => {
    if (file && file.type === 'text/csv') {
      setIsUploading(true);
      setUploadError('');
      
      try {
        const result = await apiService.uploadCSV(file);
        
        if (result.success) {
          setFileName(result.filename);
          setCsvData(result.data);
          setCsvStats(result.stats);
          setColumnDescriptions(result.column_descriptions || {});
          navigate('/edit');
        } else {
          setUploadError('Upload failed. Please try again.');
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError(error.message || 'Upload failed. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else {
      setUploadError('Please upload a valid CSV file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div>
      <Header></Header>
      <div className="upload-page">
          <UploadInfo />
          <ProgressDots />
        <div
          className="upload-dropzone upload-area"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="upload-input"
          />
          <div className="dropzone-content">
            <img src={uploadLogo} alt="Upload Logo"/>
            <p className="dropzone-text">Drag and drop a CSV or browse to attach</p>
            {isUploading && <p className="upload-status">Uploading...</p>}
            {uploadError && <p className="upload-error">{uploadError}</p>}
            <button 
              className="attach-button" 
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Your CSV'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
