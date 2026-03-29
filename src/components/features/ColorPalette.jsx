import React from 'react';
import './ColorPalette.css';

const DEFAULT_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', 
  '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', 
  '#a855f7', '#ec4899'
];

const ColorPalette = ({ color, onColorChange }) => {
  return (
    <div className="color-palette-container">
      <h3 className="palette-title">Colors</h3>
      
      <div className="palette-grid">
        {DEFAULT_COLORS.map(c => (
          <button
            key={c}
            className={`color-swatch ${color === c ? 'active' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => onColorChange(c)}
            title={c}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>

      <div className="custom-color-picker">
        <label htmlFor="custom-color">Custom:</label>
        <input 
          id="custom-color"
          type="color" 
          value={color} 
          onChange={(e) => onColorChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ColorPalette;
