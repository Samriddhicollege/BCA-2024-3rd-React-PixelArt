import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import './SaveModal.css';

const SaveModal = ({ isOpen, onClose, onSave, initialTitle = '' }) => {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
    }
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
      setTitle(''); // Reset after save
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <Card className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Save Artwork</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <Input 
            label="Artwork Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Masterpiece"
            autoFocus
          />
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!title.trim()}>
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SaveModal;
