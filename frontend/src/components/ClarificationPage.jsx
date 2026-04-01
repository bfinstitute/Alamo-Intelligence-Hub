import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCsv } from '../context/CsvContext';
import AppLayout from './AppLayout';
import '../styles/ClarificationPage.css';

const FLAGGED_ITEMS = [
  {
    id: 1,
    title: 'Row Values Unclear',
    description: 'The field "geo_ref" could not be interpreted. Please clarify what this column represents.',
  },
];

// Rows to highlight as flagged (0-indexed)
const FLAGGED_ROWS = new Set([0, 2, 4]);

export default function ClarificationPage() {
  const navigate = useNavigate();
  const { csvData, fileName, csvStats } = useCsv();
  const [issuesOnly, setIssuesOnly] = useState(false);
  const [expandedItem, setExpandedItem] = useState(0);

  const headers = csvData && csvData.length > 0 ? Object.keys(csvData[0]) : [];
  const rows = csvData || [];
  const displayRows = issuesOnly ? rows.filter((_, i) => FLAGGED_ROWS.has(i)) : rows;

  const uploadedDate = 'Mar 25, 2026';
  const totalRows = csvStats ? csvStats.rows : rows.length;

  return (
    <AppLayout>
      <div className="clarification-page">
        {/* ── Left Panel ── */}
        <div className="clarification-left">
          <div className="clarification-left-header">
            <div>
              <p className="clarification-left-label">Clarification Response</p>
              <span className="clarification-request-badge">Request 1/{FLAGGED_ITEMS.length}</span>
            </div>
          </div>

          <h2 className="clarification-left-title">BFI's Clarification Request</h2>
          <p className="clarification-left-sub">
            Review each flagged item below and provide a response or correction.
          </p>

          <div className="clarification-items">
            {FLAGGED_ITEMS.map((item, i) => (
              <div
                key={item.id}
                className={`clarification-item${expandedItem === i ? ' open' : ''}`}
                onClick={() => setExpandedItem(expandedItem === i ? null : i)}
              >
                <div className="clarification-item-header">
                  <div className="clarification-item-dot" />
                  <span className="clarification-item-title">{item.title}</span>
                  <svg className="clarification-item-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={expandedItem === i ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}/>
                  </svg>
                </div>
                {expandedItem === i && (
                  <p className="clarification-item-desc">{item.description}</p>
                )}
              </div>
            ))}
          </div>

          <div className="clarification-left-footer">
            <button className="clarification-nav-btn secondary" onClick={() => navigate('/submissions')}>
              Back
            </button>
            <button className="clarification-nav-btn primary" onClick={() => navigate('/submissions')}>
              Next
            </button>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="clarification-right">
          <div className="clarification-right-header">
            <div>
              <h2 className="clarification-right-title">Submitted Dataset</h2>
              <p className="clarification-right-meta">
                {fileName || 'samplefile2.csv'} &nbsp;·&nbsp; {totalRows?.toLocaleString() || '—'} rows &nbsp;·&nbsp; Uploaded {uploadedDate}
              </p>
            </div>
            <div className="clarification-right-controls">
              <span className="issues-badge">{FLAGGED_ROWS.size} Issues</span>
              <label className="issues-toggle-label">
                <span>Issues Only</span>
                <button
                  className={`issues-toggle${issuesOnly ? ' on' : ''}`}
                  onClick={() => setIssuesOnly(p => !p)}
                  type="button"
                >
                  <span className="issues-toggle-thumb" />
                </button>
              </label>
            </div>
          </div>

          <div className="clarification-table-wrap">
            {headers.length === 0 ? (
              <div className="clarification-no-data">
                <p>No dataset loaded. Upload a CSV first.</p>
                <button className="clarification-nav-btn primary" onClick={() => navigate('/upload')}>Go to Upload</button>
              </div>
            ) : (
              <table className="clarification-table">
                <thead>
                  <tr>
                    {headers.map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayRows.slice(0, 50).map((row, rowIdx) => {
                    const originalIdx = issuesOnly
                      ? Array.from(FLAGGED_ROWS)[rowIdx]
                      : rowIdx;
                    const isFlagged = FLAGGED_ROWS.has(originalIdx);
                    return (
                      <tr key={rowIdx} className={isFlagged ? 'flagged-row' : ''}>
                        {headers.map(h => (
                          <td key={h} className={isFlagged ? 'flagged-cell' : ''}>{row[h]}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
