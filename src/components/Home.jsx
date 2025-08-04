import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';
import mainLogoWhite from '../assets/images/BFI_Logo(White).svg'
import mainLogo from '../assets/images/BFI_Logo.svg'
import homeImage from '../assets/images/Thumbnail_Final.webp'

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // You can add real auth here
    if (email && password) {
      setSignedIn(true);
      navigate('/upload');
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className="main-page">
      <div className="main-info-left">
        <header>
          <a href="/">
            <img src={mainLogoWhite} alt="Better Futures Institute" className="logo-left-header"/>
          </a>
        </header>
        <div className='left-image'>
          <img src={homeImage} alt="Better Futures Institute"/>
        </div> 
        <footer>
          <p className='bfiLink'>www.bfinstitute.org</p>
          <p className='copyright'>&copy; {new Date().getFullYear()} Better Futures Institute. All rights reserved.</p>
        </footer>
      </div>

      <div className="main-info-right">
        <a href="/" className="logo-right">
          <img src={mainLogo} alt="Better Futures Institute"/>
        </a>
        <div className="signin-container">
          <form className="signin-form" onSubmit={handleLogin}>
            <h2>Log in to your account</h2>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Continue</button>
          </form>
        </div>
      </div>
    </div>
  );
}
