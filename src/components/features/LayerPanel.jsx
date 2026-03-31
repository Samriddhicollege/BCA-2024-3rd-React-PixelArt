import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaPlus, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import './LayerPanel.css';

const LayerPanel = ({ 
  layers, 
  activeLayerId, 
  onSelectLayer, 
  onAddLayer, 
  onDeleteLayer, 
  onToggleVisibility, 
  onRenameLayer 
}) => {
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState('');

  const handleStartEdit = (layer) => {
    setEditingId(layer.id);
    setTempName(layer.name);
  };

  const handleSaveEdit = (id) => {
    if (tempName.trim()) {
      onRenameLayer(id, tempName.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') handleSaveEdit(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <div className="layer-panel">
      <div className="layer-panel-header">
        <h3>Layers</h3>
        <button className="add-layer-btn" onClick={onAddLayer} title="Add Layer">
          <FaPlus />
        </button>
      </div>
      
      <div className="layer-list">
        {[...layers].reverse().map((layer) => (
          <div 
            key={layer.id} 
            className={`layer-item ${activeLayerId === layer.id ? 'active' : ''}`}
            onClick={() => onSelectLayer(layer.id)}
          >
            <button 
              className="visibility-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(layer.id);
              }}
              title={layer.isVisible ? "Hide Layer" : "Show Layer"}
            >
              {layer.isVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
            
            <div className="layer-info">
              {editingId === layer.id ? (
                <input
                  autoFocus
                  className="layer-name-input"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={() => handleSaveEdit(layer.id)}
                  onKeyDown={(e) => handleKeyDown(e, layer.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="layer-name">{layer.name}</span>
              )}
            </div>

            <div className="layer-actions">
              {editingId === layer.id ? (
                <button 
                  className="action-btn save-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit(layer.id);
                  }}
                >
                  <FaCheck />
                </button>
              ) : (
                <button 
                  className="action-btn edit-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(layer);
                  }}
                >
                  <FaEdit />
                </button>
              )}
              <button 
                className="action-btn delete-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLayer(layer.id);
                }}
                disabled={layers.length <= 1}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel;
