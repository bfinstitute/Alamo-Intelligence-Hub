import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import UploadPage from './components/UploadPage';
import ProtectedRoute from './components/ProtectedRoute';
import CSVEditor from './components/CSVEditor';
import SuccessPage from './components/SuccessPage';
import SubmissionsPage from './components/SubmissionsPage';
import ClarificationPage from './components/ClarificationPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <CSVEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <SubmissionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clarification"
          element={
            <ProtectedRoute>
              <ClarificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
