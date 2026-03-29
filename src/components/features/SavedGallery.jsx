import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatDate } from '../../utils/helpers';
import { FaUpload, FaTrash } from 'react-icons/fa';
import './SavedGallery.css';

const SavedGallery = ({ artworks, onLoad, onDelete }) => {
  if (!artworks || artworks.length === 0) {
    return (
      <div className="empty-gallery">
        <p>No saved artworks yet. Create one and save it!</p>
      </div>
    );
  }

  return (
    <div className="gallery-grid">
      {artworks.map((art) => (
        <Card key={art.id} className="gallery-card">
          <div className="gallery-preview">
            <div 
              className="preview-grid"
              style={{
                gridTemplateColumns: `repeat(${art.grid[0]?.length || 1}, 1fr)`,
                gridTemplateRows: `repeat(${art.grid.length}, 1fr)`
              }}
            >
              {art.grid.map((row, y) => 
                row.map((color, x) => (
                  <div 
                    key={`${y}-${x}`}
                    className="preview-cell"
                    style={{ backgroundColor: color || 'transparent' }}
                  />
                ))
              )}
            </div>
          </div>
          <div className="gallery-info">
            <h4 className="gallery-title" title={art.title}>{art.title}</h4>
            <span className="gallery-date">{formatDate(art.createdAt)}</span>
          </div>
          <div className="gallery-actions">
            <Button variant="primary" size="sm" onClick={() => onLoad(art)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <FaUpload /> Load
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(art.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <FaTrash /> Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SavedGallery;
