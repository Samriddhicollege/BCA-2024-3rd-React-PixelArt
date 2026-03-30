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

const Canvas = ({ grid, onCellUpdate, onStrokeEnd, activeTool, eraserSize }) => {
  const isMouseDownRef = useRef(false);
  const containerRef = useRef(null);
  const eraserRef = useRef(null);
  const touchHandlersAttached = useRef(false);

  const handleMouseDown = useCallback((y, x) => {
    isMouseDownRef.current = true;
    onCellUpdate(y, x);
  }, [onCellUpdate]);

  const handleMouseEnter = useCallback((y, x) => {
    if (eraserRef.current) {
      const offset = (eraserSize % 2 === 0 ? Math.floor(eraserSize / 2) - 1 : Math.floor(eraserSize / 2));
      const visualY = y - offset;
      const visualX = x - offset;
      
      // Direct DOM mutation for 60FPS eraser visual movement
      eraserRef.current.style.setProperty('--y', visualY);
      eraserRef.current.style.setProperty('--x', visualX);
      eraserRef.current.style.display = 'block';
    }
    
    if (isMouseDownRef.current) {
      onCellUpdate(y, x);
    }
  }, [onCellUpdate, eraserSize]);

  const handleMouseUp = useCallback(() => {
    if (isMouseDownRef.current) {
      if (onStrokeEnd) onStrokeEnd();
    }
    isMouseDownRef.current = false;
  }, [onStrokeEnd]);

  const handleMouseLeave = useCallback(() => {
    if (eraserRef.current) {
      eraserRef.current.style.display = 'none';
    }
    handleMouseUp();
  }, [handleMouseUp]);

  // ── Touch support (mobile tap & drag to draw) ──
  const getCellFromTouch = useCallback((touch) => {
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el || !el.id) return null;
    const match = el.id.match(/^cell-(\d+)-(\d+)$/);
    if (!match) return null;
    return { y: parseInt(match[1], 10), x: parseInt(match[2], 10) };
  }, []);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length !== 1) return;
    isMouseDownRef.current = true;
    const cell = getCellFromTouch(e.touches[0]);
    if (cell) onCellUpdate(cell.y, cell.x);
  }, [onCellUpdate, getCellFromTouch]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (!isMouseDownRef.current || e.touches.length !== 1) return;
    const cell = getCellFromTouch(e.touches[0]);
    if (cell) onCellUpdate(cell.y, cell.x);
  }, [onCellUpdate, getCellFromTouch]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    if (isMouseDownRef.current) {
      if (onStrokeEnd) onStrokeEnd();
    }
    isMouseDownRef.current = false;
  }, [onStrokeEnd]);

  // Attach touch listeners as non-passive so preventDefault works
  const setContainerRef = useCallback((node) => {
    if (node && !touchHandlersAttached.current) {
      containerRef.current = node;
      touchHandlersAttached.current = true;
      node.addEventListener('touchstart', handleTouchStart, { passive: false });
      node.addEventListener('touchmove', handleTouchMove, { passive: false });
      node.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  if (!grid || !grid.length) return null;

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  return (
    <div
      className="canvas-container"
      ref={setContainerRef}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        className="canvas-grid"
        data-active-tool={activeTool}
        style={{
          "--cols": cols,
          "--rows": rows,
          "--eraser-size": eraserSize,
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

        {activeTool === 'eraser' && (
          <div
            ref={eraserRef}
            className="eraser-visual"
            style={{ display: 'none' }}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(Canvas);
