import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaintBrush, FaEraser, FaFillDrip, FaUndo, FaRedo, FaTrash, FaSave, FaArrowsAltH, FaArrowsAltV, FaPalette as FaPaletteIcon, FaSyncAlt } from 'react-icons/fa';
import ColorPalette from './ColorPalette';
import './Toolbar.css';

const Toolbar = ({ 
  activeTool, setActiveTool, 
  onUndo, onRedo, canUndo, canRedo, 
  onClear, onSave,
  eraserSize, setEraserSize,
  canvasWidth, canvasHeight, onWidthChange, onHeightChange, onResetDimensions,
  color, onColorChange
}) => {
  const [showEraserTip, setShowEraserTip] = useState(false);
  const [showWidthTip, setShowWidthTip] = useState(false);
  const [showHeightTip, setShowHeightTip] = useState(false);
  const [showColorTip, setShowColorTip] = useState(false);
  
  const eraserRef = useRef(null);
  const widthRef = useRef(null);
  const heightRef = useRef(null);
  const colorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eraserRef.current && !eraserRef.current.contains(event.target)) {
        setShowEraserTip(false);
      }
      if (widthRef.current && !widthRef.current.contains(event.target)) {
        setShowWidthTip(false);
      }
      if (heightRef.current && !heightRef.current.contains(event.target)) {
        setShowHeightTip(false);
      }
      if (colorRef.current && !colorRef.current.contains(event.target)) {
        setShowColorTip(false);
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

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

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
        <div className="tool-wrapper" ref={colorRef}>
          <button 
            className={`tool-btn color-preview-btn ${showColorTip ? 'active' : ''}`}
            onClick={() => setShowColorTip(!showColorTip)}
            title="Color Palette"
          >
            <div className="color-swatch-indicator" style={{ backgroundColor: color }} />
            <FaPaletteIcon className="mobile-only-icon" />
          </button>
          {showColorTip && (
            <div className="tool-tooltip palette-tooltip">
              <ColorPalette color={color} onColorChange={onColorChange} />
            </div>
          )}
        </div>
      </div>

      <div className="toolbar-divider" />

      {/* Canvas Width Tooltip */}
      <div className="toolbar-group">
        <div className="tool-wrapper" ref={widthRef}>
          <button
            className={`tool-btn ${showWidthTip ? 'active' : ''}`}
            onClick={() => { setShowWidthTip(!showWidthTip); setShowHeightTip(false); }}
            title="Canvas Width"
          >
            <FaArrowsAltH />
          </button>
          {showWidthTip && (
            <div className="tool-tooltip size-tooltip">
              <label>Width: {canvasWidth}</label>
              <input
                type="range"
                className="size-slider"
                value={canvasWidth}
                onChange={(e) => onWidthChange(Number(e.target.value))}
                min="1" max="256"
              />
            </div>
          )}
        </div>
        
        {/* Canvas Height Tooltip */}
        <div className="tool-wrapper" ref={heightRef}>
          <button
            className={`tool-btn ${showHeightTip ? 'active' : ''}`}
            onClick={() => { setShowHeightTip(!showHeightTip); setShowWidthTip(false); }}
            title="Canvas Height"
          >
            <FaArrowsAltV />
          </button>
          {showHeightTip && (
            <div className="tool-tooltip size-tooltip">
              <label>Height: {canvasHeight}</label>
              <input
                type="range"
                className="size-slider"
                value={canvasHeight}
                onChange={(e) => onHeightChange(Number(e.target.value))}
                min="1" max="256"
              />
            </div>
          )}
        </div>
        
        <button 
          className="tool-btn reset-btn"
          onClick={onResetDimensions}
          title="Reset to 16x16"
        >
          <FaSyncAlt />
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
