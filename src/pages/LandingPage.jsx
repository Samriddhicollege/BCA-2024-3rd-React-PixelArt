import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import useLocalStorage from '../hooks/useLocalStorage';
import { FaPalette, FaImages, FaMousePointer, FaLayerGroup, FaHistory, FaCheckCircle } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  const [savedArts] = useLocalStorage('pixel-arts', []);

  const lastArt = savedArts.length > 0 ? savedArts[0] : null;

  const FeatureCard = ({ icon, title, description }) => (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      padding: '2rem',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      flex: '1',
      minWidth: '280px',
      transition: 'transform 0.2s ease, border-color 0.2s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.borderColor = 'var(--primary)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--border-color)';
    }}>
      <div style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{icon}</div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>{description}</p>
    </div>
  );

  const Step = ({ number, title, description }) => (
    <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: '1.2rem',
        flexShrink: 0
      }}>
        {number}
      </div>
      <div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{title}</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{description}</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '4rem', padding: '4rem 2rem' }}>
      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
          fontWeight: '800', 
          background: 'linear-gradient(to right, #60a5fa, #c084fc)', 
          WebkitBackgroundClip: 'text', 
          color: 'transparent', 
          marginBottom: '0.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '1rem' 
        }}>
          <FaPalette style={{ color: '#60a5fa' }} /> Pixel Art Maker
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', maxWidth: '800px', lineHeight: '1.6' }}>
          Unleash your creativity with our high-performance pixel art editor. 
          Create, edit, and manage your masterpieces directly in your browser.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
          <Button variant="primary" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem', display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: '700' }} onClick={() => navigate('/editor')}>
            <FaPalette /> Start Creating
          </Button>
          <Button variant="secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem', display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: '700' }} onClick={() => navigate('/gallery')}>
            <FaImages /> View Gallery
          </Button>
        </div>
      </section>

      {/* Recent Work / Continue Section */}
      {lastArt && (
        <section style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          width: '100%', 
          backgroundColor: 'rgba(59, 130, 246, 0.1)', 
          padding: '1.5rem 2rem', 
          borderRadius: 'var(--radius)', 
          border: '1px solid var(--primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontSize: '2rem', color: 'var(--primary)' }}><FaHistory /></div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>Continue where you left off</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Recent: <strong>{lastArt.title}</strong></p>
            </div>
          </div>
          <Button variant="primary" onClick={() => navigate(`/editor/${lastArt.id}`)} style={{ padding: '0.75rem 1.5rem' }}>
            Open Editor
          </Button>
        </section>
      )}

      {/* Features Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '3rem' }}>Why Pixel Art Maker?</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          <FeatureCard 
            icon={<FaMousePointer />} 
            title="Fluid Editing" 
            description="Experience buttery-smooth drawing with a direct DOM-manipulated canvas. No lag, just pure creativity." 
          />
          <FeatureCard 
            icon={<FaLayerGroup />} 
            title="Flexible Canvas" 
            description="Set your own dimensions up to 256x256. Perfect for everything from game assets to detailed portraits." 
          />
          <FeatureCard 
            icon={<FaHistory />} 
            title="Smart History" 
            description="Full undo/redo support means you never have to worry about mistakes. Experiment freely!" 
          />
          <FeatureCard 
            icon={<FaCheckCircle />} 
            title="Local Storage" 
            description="Your work is yours. Everything is saved locally in your browser, keeping your art private and secure." 
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        width: '100%', 
        backgroundColor: 'var(--card-bg)', 
        padding: '4rem', 
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border-color)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Get started in seconds</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            No signups, no setup. Just open the editor and start painting your vision.
          </p>
          <Button variant="primary" onClick={() => navigate('/editor')} style={{ padding: '1rem 2rem' }}>
             Open the Editor →
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Step 
            number="1" 
            title="Choose Dimensions" 
            description="Select your canvas size. Start small for icons or go big for detailed scene." 
          />
          <Step 
            number="2" 
            title="Draw Your Vision" 
            description="Use the brush, eraser, and fill tools with your custom color palette." 
          />
          <Step 
            number="3" 
            title="Save & Manage" 
            description="Give your art a title and save it to your personal gallery for future editing." 
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} Pixel Art Maker. Made for Pixel Artists.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
