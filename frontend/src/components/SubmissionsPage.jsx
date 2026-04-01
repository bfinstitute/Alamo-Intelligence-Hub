import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import '../styles/SubmissionsPage.css';
import apiService from '../services/api';

const MOCK_FILES = [
  { name: 'samplefile2.csv', owner: 'me', created: 'Mar 25, 2026', size: '1.2 MB' },
  { name: 'samplefile2.csv', owner: 'me', created: 'Mar 25, 2026', size: '1.2 MB' },
  { name: 'samplefile2.csv', owner: 'me', created: 'Mar 25, 2026', size: '1.2 MB' },
  { name: 'samplefile2.csv', owner: 'me', created: 'Mar 25, 2026', size: '1.2 MB' },
  { name: 'samplefile2.csv', owner: 'me', created: 'Mar 25, 2026', size: '1.2 MB' },
  { name: 'samplefile2.csv', owner: 'me', created: 'Mar 25, 2026', size: '1.2 MB' },
  { name: 'samplefile2.csv', owner: 'me', created: 'Mar 25, 2026', size: '1.2 MB' },
  { name: 'samplefile2.csv', owner: 'me', created: 'Mar 25, 2026', size: '1.2 MB' },
];

const MOCK_FOLDERS = ['Pothole Data', 'Pothole Data', 'Pothole Data'];

export default function SubmissionsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'cards'
  const [showDisplayMenu, setShowDisplayMenu] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [files, setFiles] = useState(MOCK_FILES);

  useEffect(() => {
    apiService.listFiles().then(res => {
      if (res && res.files && res.files.length > 0) {
        const mapped = res.files.map(f => ({
          name: f.filename || f.name,
          owner: 'me',
          created: f.modified ? new Date(f.modified * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
          size: f.size ? (f.size / (1024 * 1024)).toFixed(1) + ' MB' : '—',
        }));
        setFiles(mapped);
      }
    }).catch(() => {});
  }, []);

  return (
    <AppLayout>
      <div className="submissions-page">
        {/* ── Top Bar ── */}
        <div className="submissions-topbar">
          <div className="submissions-topbar-left">
            <h1 className="submissions-title">
              Submissions
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </h1>
            <div className="sources-view-icons">
              <button className={`view-icon-btn${viewMode === 'cards' ? ' active' : ''}`} title="Grid view" onClick={() => setViewMode('cards')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button className={`view-icon-btn${viewMode === 'list' ? ' active' : ''}`} title="List view" onClick={() => setViewMode('list')}>
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
          <div className="submissions-topbar-right">
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
            <button className="upload-btn" onClick={() => navigate('/upload')}>Upload</button>
          </div>
        </div>

        {/* ── Filter Pills ── */}
        <div className="sources-filters">
          <button className="filter-pill">Type <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
          <button className="filter-pill">People <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
          <button className="filter-pill">Modified <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>

          {/* Display dropdown */}
          <div className="display-menu-wrap">
            <button className="filter-pill" onClick={() => setShowDisplayMenu(p => !p)}>
              Display <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showDisplayMenu && (
              <div className="display-menu">
                <p className="display-menu-section">Display</p>
                <button className={`display-menu-item${viewMode === 'cards' ? ' active' : ''}`} onClick={() => { setViewMode('cards'); setShowDisplayMenu(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Cards
                </button>
                <button className={`display-menu-item${viewMode === 'list' ? ' active' : ''}`} onClick={() => { setViewMode('list'); setShowDisplayMenu(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  List
                </button>
                <p className="display-menu-section">Sort</p>
                <button className={`display-menu-item${sortBy === 'name' ? ' active' : ''}`} onClick={() => { setSortBy('name'); setShowDisplayMenu(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                  Name
                </button>
                <button className={`display-menu-item${sortBy === 'date' ? ' active' : ''}`} onClick={() => { setSortBy('date'); setShowDisplayMenu(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Date
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        {viewMode === 'list' ? (
          <div className="submissions-table-wrap">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th className="col-name">
                    Name
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                  </th>
                  <th className="col-owner">Owner</th>
                  <th className="col-created">
                    Created
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </th>
                  <th className="col-size">File Size</th>
                  <th className="col-sort">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>
                    Sort
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, i) => (
                  <tr key={i} onClick={() => navigate('/clarification')} className="submissions-row">
                    <td className="col-name">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      {file.name}
                    </td>
                    <td className="col-owner">
                      <div className="owner-avatar"></div>
                      {file.owner}
                    </td>
                    <td className="col-created">{file.created}</td>
                    <td className="col-size">{file.size}</td>
                    <td className="col-sort">
                      <button className="row-more-btn" onClick={e => e.stopPropagation()}>···</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="submissions-cards-view">
            <div className="submissions-section-header">
              <span className="submissions-section-title">Folders</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div className="folders-grid">
              {MOCK_FOLDERS.map((folder, i) => (
                <div key={i} className="folder-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span className="folder-name">{folder}</span>
                  <button className="folder-more-btn">···</button>
                </div>
              ))}
            </div>

            <div className="submissions-section-header" style={{ marginTop: 24 }}>
              <span className="submissions-section-title">Files</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div className="files-cards-grid">
              {files.map((file, i) => (
                <div key={i} className="file-card" onClick={() => navigate('/clarification')}>
                  <div className="file-card-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span className="file-card-name">{file.name}</span>
                  </div>
                  <div className="file-card-preview">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Close display menu when clicking outside */}
      {showDisplayMenu && (
        <div className="display-menu-backdrop" onClick={() => setShowDisplayMenu(false)} />
      )}
    </AppLayout>
  );
}
