import { useNavigate } from 'react-router-dom';
import '../styles/UploadPage.css';
import Header from './Header';
import successLogo from '../assets/images/iconoir_check-circle.svg'
import ProgressDots from './ProgressDots';
import UploadInfo from './UploadInfo';

export default function UploadPage() {
    const navigate = useNavigate();

    return (
    <div>
        <Header></Header>
        <div className="upload-page">
            <UploadInfo />
            <ProgressDots />
            <div className="upload-dropzone">
                <div className="dropzone-content">
                <img src={successLogo} alt="Success Logo"/>
                <p className="dropzone-text">Upload Succesful</p>
                <button className='attach-button' onClick={() => navigate('/upload')}>Submit Another</button>
                </div>
            </div>
        </div>
    </div>
    );
}
