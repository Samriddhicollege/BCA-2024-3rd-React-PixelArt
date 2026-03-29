import React, { useRef, useCallback } from 'react';
import './Canvas.css';

const Cell = React.memo(({ y, x, color, onMouseDown, onMouseEnter }) => (
  <div
    id={`cell-${y}-${x}`}
    className="canvas-cell"
    style={{ backgroundColor: color || 'transparent' }}
    onMouseDown={() => onMouseDown(y, x)}
    onMouseEnter={() => onMouseEnter(y, x)}
    onDragStart={(e) => e.preventDefault()}
  />
));

const Canvas = ({ grid, onCellUpdate, onStrokeEnd }) => {
  const isMouseDownRef = useRef(false);

  const handleMouseDown = useCallback((y, x) => {
    isMouseDownRef.current = true;
    onCellUpdate(y, x);
  }, [onCellUpdate]);

  const handleMouseEnter = useCallback((y, x) => {
    if (isMouseDownRef.current) {
      onCellUpdate(y, x);
    }
  }, [onCellUpdate]);

  const handleMouseUp = useCallback(() => {
    if (isMouseDownRef.current) {
        if (onStrokeEnd) onStrokeEnd();
    }
    isMouseDownRef.current = false;
  }, [onStrokeEnd]);

  if (!grid || !grid.length) return null;

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  return (
    <div 
      className="canvas-container"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragStart={(e) => e.preventDefault()}
    >
      <div 
        className="canvas-grid" 
        style={{
          "--cols": cols,
          "--rows": rows,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}
      >
        {grid.map((row, y) => (
          row.map((color, x) => (
            <Cell
              key={`${y}-${x}`}
              y={y}
              x={x}
              color={color}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default React.memo(Canvas);
