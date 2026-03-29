import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import SavedGallery from '../components/features/SavedGallery';
import { FaImages } from 'react-icons/fa';

const GalleryPage = () => {
  const [savedArts, setSavedArts] = useLocalStorage('pixel-arts', []);
  const navigate = useNavigate();

  const handleLoad = (art) => {
    if (window.confirm("Loading this will take you to the editor and overwrite any unsaved canvas. Continue?")) {
      navigate(`/editor/${art.id}`);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this artwork?")) {
      setSavedArts(prev => prev.filter(art => art.id !== id));
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FaImages style={{ color: 'var(--primary)' }} /> Your Gallery
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your saved pixel art masterpieces.
        </p>
      </header>

      <main>
        <SavedGallery
          artworks={savedArts}
          onLoad={handleLoad}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default GalleryPage;
