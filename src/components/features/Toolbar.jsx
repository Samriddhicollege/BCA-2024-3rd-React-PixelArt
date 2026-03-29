import React, { useState, useEffect, useRef } from 'react';
import { FaPaintBrush, FaEraser, FaFillDrip, FaUndo, FaRedo, FaTrash, FaSave } from 'react-icons/fa';
import './Toolbar.css';

const Toolbar = ({ 
  activeTool, setActiveTool, 
  onUndo, onRedo, canUndo, canRedo, 
  onClear, onSave,
  eraserSize, setEraserSize
}) => {
  const [showEraserTip, setShowEraserTip] = useState(false);
  const eraserRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Hide tooltip if clicked outside the eraser tool wrapper
      if (eraserRef.current && !eraserRef.current.contains(event.target)) {
        setShowEraserTip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEraserClick = () => {
    if (activeTool !== 'eraser') {
      setActiveTool('eraser');
      setShowEraserTip(true);
    } else {
      setShowEraserTip(!showEraserTip);
    }
  };
  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        <button 
          className={`tool-btn ${activeTool === 'brush' ? 'active' : ''}`}
          onClick={() => setActiveTool('brush')}
          title="Brush Tool (Paint)"
        >
          <FaPaintBrush />
        </button>
        <div className="tool-wrapper" ref={eraserRef}>
          <button 
            className={`tool-btn ${activeTool === 'eraser' ? 'active' : ''}`}
            onClick={handleEraserClick}
            title="Eraser Tool"
          >
            <FaEraser />
          </button>
          {(activeTool === 'eraser' && showEraserTip) && (
            <div className="tool-tooltip">
              <label>Eraser Size: {eraserSize}</label>
              <input type="range" min="1" max="10" value={eraserSize} onChange={e => setEraserSize(Number(e.target.value))} />
            </div>
          )}
        </div>
        <button 
          className={`tool-btn ${activeTool === 'fill' ? 'active' : ''}`}
          onClick={() => setActiveTool('fill')}
          title="Fill Tool (Flood Fill)"
        >
          <FaFillDrip />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button 
          className="tool-btn action-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <FaUndo />
        </button>
        <button 
          className="tool-btn action-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <FaRedo />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button 
          className="tool-btn danger-btn"
          onClick={onClear}
          title="Clear Canvas"
        >
          <FaTrash />
        </button>
        <button 
          className="tool-btn primary-btn"
          onClick={onSave}
          title="Save Artwork"
        >
          <FaSave />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
