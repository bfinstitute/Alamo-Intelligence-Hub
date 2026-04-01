import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UploadPage.css';
import { useCsv } from '../context/CsvContext';
import AppLayout from './AppLayout';
import GiveContextDrawer from './GiveContextDrawer';
import apiService from '../services/api';

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { setCsvData, setFileName, setCsvStats, setColumnDescriptions } = useCsv();

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFile = async (file) => {
    if (!file || file.type !== 'text/csv') {
      setUploadError('Please upload a valid CSV file.');
      return;
    }
    setIsUploading(true);
    setUploadError('');
    try {
      const result = await apiService.uploadCSV(file);
      if (result.success) {
        setFileName(result.filename);
        setCsvData(result.data);
        setCsvStats(result.stats);
        setColumnDescriptions(result.column_descriptions || {});
        setUploadedFileName(result.filename);
        setDrawerOpen(true);
      } else {
        setUploadError('Upload failed. Please try again.');
      }
    } catch (error) {
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileSelect = (e) => handleFile(e.target.files[0]);

  const handleContextSubmit = () => {
    setDrawerOpen(false);
    setShowSuccess(true);
  };

  return (
    <AppLayout>
      <div className="sources-page">
        {/* ── Top Bar ── */}
        <div className="sources-topbar">
          <div className="sources-topbar-left">
            <h1 className="sources-title">
              My Sources
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </h1>
            <div className="sources-view-icons">
              <button className="view-icon-btn active" title="Grid view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button className="view-icon-btn" title="List view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
              <button className="view-icon-btn" title="Recent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="sources-topbar-right">
            <div className="storage-indicator">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
              <span className="storage-text">Storage</span>
              <span className="storage-used">3 GB Used</span>
            </div>
            <button className="storage-info-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </button>
            <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
              Upload
            </button>
          </div>
        </div>

        {/* ── Filter Pills ── */}
        <div className="sources-filters">
          <button className="filter-pill">Type <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
          <button className="filter-pill">People <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
          <button className="filter-pill">Modified <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
        </div>

        {/* ── Drop Zone / Empty State ── */}
        <div
          className={`sources-dropzone${isDragging ? ' dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="upload-input-hidden"
          />

          {isDragging ? (
            <div className="dropzone-drag-active">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
              </svg>
              <h2 className="dropzone-drag-title">A place for all your files</h2>
              <p className="dropzone-drag-sub">Drag your files and folders here or use the button to upload</p>
              <button className="dropzone-drag-btn" onClick={() => fileInputRef.current.click()}>
                Drag and drop files to upload them to Sources
              </button>
            </div>
          ) : (
            <div className="dropzone-empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
              <h2 className="dropzone-empty-title">Build your sources</h2>
              <p className="dropzone-empty-sub">Drag your files and folders here or use the "Upload" button to upload</p>
              {isUploading && <p className="upload-status-text">Uploading...</p>}
              {uploadError && <p className="upload-error-text">{uploadError}</p>}
            </div>
          )}
        </div>
      </div>

      {/* ── Give Context Drawer ── */}
      <GiveContextDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleContextSubmit}
        fileName={uploadedFileName}
      />

      {/* ── Success Modal ── */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <h2 className="success-modal-title">Your dataset has been submitted</h2>
            <p className="success-modal-body">
              BFI has received your files and will begin the intake process shortly. You'll be notified if we need any clarification. In the meantime, you can track the status of this submission from your dashboard.
            </p>
            <button
              className="success-modal-btn"
              onClick={() => { setShowSuccess(false); navigate('/submissions'); }}
            >
              Back To Dashboard
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
