import '../styles/CSVEditor.css';
import ProgressDots from './ProgressDots';
import UploadInfo from './UploadInfo';
import Header from './Header';
import ToggleSwitch from './ToggleSwitch';

const headerDescriptions = {
  street: 'The street name or location info.',
  age: 'Age in years.',
  email: 'User email address.',
  // Add more headers and their descriptions here as needed
};

export default function CSVEditor() {
  return (
    <div>
      <Header />
      <div className='preview-page'>
        <UploadInfo />
        <ProgressDots />
        <ToggleSwitch />
      </div>
    </div>
  );
}
