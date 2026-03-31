import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import PixelSprite, { SPRITES } from '../components/ui/PixelSprite';
import useLocalStorage from '../hooks/useLocalStorage';
import { FaPalette, FaImages, FaMousePointer, FaLayerGroup, FaHistory, FaCheckCircle, FaRocket } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  const [savedArts] = useLocalStorage('pixel-arts', []);

  const lastArt = savedArts.length > 0 ? savedArts[0] : null;

  const FeatureCard = ({ icon, title, description, index }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, scale: 1.02 }}
      style={{
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
        cursor: 'default',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{icon}</div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>{description}</p>
    </motion.div>
  );

  const Step = ({ number, title, description, index }) => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 + index * 0.1 }}
      style={{ display: 'flex', gap: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}
    >
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 10 }}
        style={{
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
          flexShrink: 0,
          boxShadow: '0 0 15px var(--primary-glow)'
        }}
      >
        {number}
      </motion.div>
      <div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{title}</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{description}</p>
      </div>
    </motion.div>
  );

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .pixel-sprite-container {
            display: none !important;
          }
          .hero-buttons {
            flex-direction: column;
            width: 100%;
          }
          .hero-buttons button {
            width: 100%;
          }
          .recent-work-card {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1.5rem !important;
            gap: 1.5rem !important;
          }
          .recent-work-card div {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1rem !important;
          }
          .recent-work-card button {
            width: 100%;
          }
        }
      `}</style>
      <div style={{ 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        gap: 'clamp(3rem, 10vh, 8rem)', 
        padding: 'clamp(2rem, 8vh, 6rem) 1rem', 
        overflowX: 'hidden' 
      }}>
      {/* Background Pixel Rain / Grid Background */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '100%', 
        backgroundImage: 'radial-gradient(var(--grid-border) 1px, transparent 1px)',
        backgroundSize: 'clamp(20px, 4vw, 40px) clamp(20px, 4vw, 40px)',
        opacity: 0.1,
        zIndex: -1,
        maskImage: 'linear-gradient(to bottom, black, transparent)'
      }} />

      {/* Hero Section */}
      <section style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2.5rem' }}>
        {/* Responsive Sprites */}
        <div style={{ position: 'absolute', top: '-40px', left: '10%', opacity: 0.5, transform: 'scale(0.8)' }}>
          <PixelSprite data={SPRITES.HEART} scale={4} delay={0} />
        </div>
        <div style={{ display: 'none', position: 'absolute', bottom: '0', right: '10%', opacity: 0.5 }}>
          {/* Hidden on small mobile in CSS below, or just keep it minimal */}
          <PixelSprite data={SPRITES.GHOST} scale={5} delay={0.5} />
        </div>
        <div style={{ position: 'absolute', top: '150px', right: '15%', opacity: 0.3, transform: 'scale(0.7)' }}>
          <PixelSprite data={SPRITES.SMILEY} scale={3} delay={1} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 style={{ 
            fontSize: 'clamp(3rem, 10vw, 5.5rem)', 
            fontWeight: '900', 
            background: 'linear-gradient(135deg, #60a5fa, #c084fc, #f472b6)', 
            WebkitBackgroundClip: 'text', 
            color: 'transparent', 
            marginBottom: '0.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1.5rem',
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-pixel)'
          }}>
            <motion.span
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ display: 'inline-block' }}
            >
              <FaPalette style={{ color: '#60a5fa', filter: 'drop-shadow(0 0 10px var(--primary-glow))' }} />
            </motion.span> 
            Pixel Studio
          </h1>
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '1.4rem', 
            maxWidth: '850px', 
            lineHeight: '1.4', 
            margin: '1.5rem auto',
            fontFamily: 'var(--font-pixel)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Elevate your pixel art with a professional, layer-powered workspace designed for performance and precision.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="hero-buttons"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}
        >
          <Button 
            variant="primary" 
            style={{ padding: '1.25rem 3rem', fontSize: '1.3rem', display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: '800', borderRadius: '12px', boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)' }} 
            onClick={() => navigate('/editor')}
          >
            <FaRocket /> Launch Editor
          </Button>
          <Button 
            variant="secondary" 
            style={{ padding: '1.25rem 3rem', fontSize: '1.3rem', display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: '800', borderRadius: '12px' }} 
            onClick={() => navigate('/gallery')}
          >
            <FaImages /> Gallery
          </Button>
        </motion.div>
      </section>

      {/* Recent Work / Continue Section */}
      {lastArt && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="recent-work-card"
          style={{ 
            maxWidth: '850px', 
            margin: '0 auto', 
            width: '100%', 
            backgroundColor: 'rgba(59, 130, 246, 0.08)', 
            padding: '2.5rem 3rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2.5rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <motion.div 
              animate={{ y: [0, -5, 0] }} 
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: '2.5rem', color: 'var(--primary)' }}
            >
              <FaHistory />
            </motion.div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Jump back in</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Pick up where you left off with <strong>{lastArt.title}</strong></p>
            </div>
          </div>
          <Button variant="primary" onClick={() => navigate(`/editor/${lastArt.id}`)} style={{ padding: '0.8rem 2rem', borderRadius: '10px' }}>
            Continue Editing
          </Button>
        </motion.section>
      )}

      {/* Features Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '4rem', letterSpacing: '-0.02em' }}
        >
          Powerful Features. Tiny Pixels.
        </motion.h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          <FeatureCard 
            index={0}
            icon={<FaMousePointer />} 
            title="Multi-Layer Studio" 
            description="Build complex pieces with infinite layers. Toggle visibility, reorder, and blend your art seamlessly." 
          />
          <FeatureCard 
            index={1}
            icon={<FaLayerGroup />} 
            title="Zero-Lag Canvas" 
            description="Our direct DOM mutation engine ensures 60FPS drawing even on massive grids or multiple layers." 
          />
          <FeatureCard 
            index={2}
            icon={<FaHistory />} 
            title="Professional History" 
            description="Mistakes are part of art. Full undo/redo across all layers keeps your workflow stress-free." 
          />
          <FeatureCard 
            index={3}
            icon={<FaCheckCircle />} 
            title="Browser Secured" 
            description="No cloud login required. Your art is private, stored securely in your browser's local storage." 
          />
        </div>
      </section>

      {/* How It Works Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ 
          maxWidth: '1100px', 
          margin: '0 auto', 
          width: '100%', 
          backgroundColor: 'var(--card-bg)', 
          padding: 'clamp(2rem, 5vw, 5rem) clamp(1.5rem, 4vw, 4rem)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(3rem, 6vw, 5rem)',
          alignItems: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
            <PixelSprite data={SPRITES.PEN} scale={4} delay={0} />
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Crafted for Creators</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            No signups, no complicated setups. Just a professional pixel studio that lives in your browser and respects your privacy.
          </p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/editor')} 
            style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px' }}
          >
             Start Your Project →
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <Step 
            index={0}
            number="1" 
            title="Design with Layers" 
            description="Organize your artwork with multiple layers for sketch, line-art, and color." 
          />
          <Step 
            index={1}
            number="2" 
            title="Pixel-Perfect Tools" 
            description="Use our optimized brush, eraser, and flood-fill tools for precise control." 
          />
          <Step 
            index={2}
            number="3" 
            title="Export & Share" 
            description="Composite your layers into a single high-quality PNG for your social or game projects." 
          />
        </div>
      </motion.section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} Pixel Art Maker. Made for Pixel Artists.</p>
      </footer>
    </div>
    </>
  );
};

export default LandingPage;
