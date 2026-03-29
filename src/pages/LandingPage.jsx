import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { FaPalette, FaImages } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', gap: '2rem' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', color: 'transparent', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <FaPalette style={{ color: '#60a5fa' }} /> Pixel Art Maker
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', lineHeight: '1.6' }}>
        Create beautiful pixel art securely stored in your browser. Start with a blank canvas or edit your past masterpieces.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
        <Button variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={() => navigate('/editor')}>
          <FaPalette /> Start Drawing
        </Button>
        <Button variant="secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={() => navigate('/gallery')}>
          <FaImages /> View Gallery
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
