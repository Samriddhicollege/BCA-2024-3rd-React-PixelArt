import React, { useRef, useCallback } from 'react';
import './Canvas.css';

const Cell = React.memo(({ y, x, color, layerId }) => (
  <div
    id={layerId ? `cell-${layerId}-${y}-${x}` : `cell-${y}-${x}`}
    className="canvas-cell"
    style={{ backgroundColor: color || 'transparent' }}
  />
));

const LayerGrid = React.memo(({ layer, rows, cols, gridStyle }) => (
  <div className="canvas-grid layer-grid" style={gridStyle}>
    {layer.grid.map((row, y) => (
      row.map((color, x) => (
        <Cell
          key={`${y}-${x}`}
          y={y}
          x={x}
          color={color}
          layerId={layer.id}
        />
      ))
    ))}
  </div>
));

const Canvas = ({ layers, activeLayerId, onCellUpdate, onStrokeEnd, activeTool, eraserSize }) => {
  const isMouseDownRef = useRef(false);
  const containerRef = useRef(null);
  const eraserRef = useRef(null);
  const interactionRef = useRef(null);
  const lastCellRef = useRef({ y: -1, x: -1 });
  const touchHandlersAttached = useRef(false);

  const getCoordinates = useCallback((clientX, clientY) => {
    if (!interactionRef.current) return null;
    const rect = interactionRef.current.getBoundingClientRect();
    const xRatio = (clientX - rect.left) / rect.width;
    const yRatio = (clientY - rect.top) / rect.height;
    
    const rows = layers[0].grid.length;
    const cols = layers[0].grid[0].length;
    
    const x = Math.floor(xRatio * cols);
    const y = Math.floor(yRatio * rows);
    
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      return { x, y };
    }
    return null;
  }, [layers]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only left click
    const coords = getCoordinates(e.clientX, e.clientY);
    if (coords) {
      isMouseDownRef.current = true;
      lastCellRef.current = coords;
      onCellUpdate(coords.y, coords.x);
    }
  }, [getCoordinates, onCellUpdate]);

  const handleMouseMove = useCallback((e) => {
    const coords = getCoordinates(e.clientX, e.clientY);
    
    if (coords) {
      if (eraserRef.current) {
        const offset = (eraserSize % 2 === 0 ? Math.floor(eraserSize / 2) - 1 : Math.floor(eraserSize / 2));
        eraserRef.current.style.setProperty('--y', coords.y - offset);
        eraserRef.current.style.setProperty('--x', coords.x - offset);
        eraserRef.current.style.display = 'block';
      }
      
      if (isMouseDownRef.current && (coords.x !== lastCellRef.current.x || coords.y !== lastCellRef.current.y)) {
        lastCellRef.current = coords;
        onCellUpdate(coords.y, coords.x);
      }
    } else if (eraserRef.current) {
      eraserRef.current.style.display = 'none';
    }
  }, [getCoordinates, onCellUpdate, eraserSize]);

  const handleMouseUp = useCallback(() => {
    if (isMouseDownRef.current) {
      if (onStrokeEnd) onStrokeEnd();
    }
    isMouseDownRef.current = false;
    lastCellRef.current = { y: -1, x: -1 };
  }, [onStrokeEnd]);

  const handleMouseLeave = useCallback(() => {
    if (eraserRef.current) {
      eraserRef.current.style.display = 'none';
    }
    handleMouseUp();
  }, [handleMouseUp]);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const coords = getCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    if (coords) {
      isMouseDownRef.current = true;
      lastCellRef.current = coords;
      onCellUpdate(coords.y, coords.x);
    }
  }, [getCoordinates, onCellUpdate]);

  const handleTouchMove = useCallback((e) => {
    if (!isMouseDownRef.current || e.touches.length !== 1) return;
    const coords = getCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    if (coords && (coords.x !== lastCellRef.current.x || coords.y !== lastCellRef.current.y)) {
      lastCellRef.current = coords;
      onCellUpdate(coords.y, coords.x);
    }
  }, [getCoordinates, onCellUpdate]);

  const handleTouchEnd = useCallback((e) => {
    handleMouseUp();
  }, [handleMouseUp]);

  const setContainerRef = useCallback((node) => {
    if (node && !touchHandlersAttached.current) {
      containerRef.current = node;
      touchHandlersAttached.current = true;
      node.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
      node.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
  }, []);

  if (!layers || !layers.length) return null;

  const rows = layers[0].grid.length;
  const cols = layers[0].grid[0]?.length || 0;

  const gridStyle = {
    "--cols": cols,
    "--rows": rows,
    "--eraser-size": eraserSize,
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`
  };

  return (
    <div
      className="canvas-container"
      ref={setContainerRef}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="canvas-layers-stack" style={gridStyle}>
        {layers.map((layer) => (
          layer.isVisible && (
            <LayerGrid 
              key={layer.id} 
              layer={layer} 
              rows={rows} 
              cols={cols} 
              gridStyle={gridStyle} 
            />
          )
        ))}

        <div
          ref={interactionRef}
          className="canvas-grid interaction-overlay"
          data-active-tool={activeTool}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            width: `calc(${cols} * (var(--effective-cell-size) + 1px) - 1px)`,
            height: `calc(${rows} * (var(--effective-cell-size) + 1px) - 1px)`
          }}
        >
          {activeTool === 'eraser' && (
            <div
              ref={eraserRef}
              className="eraser-visual"
              style={{ display: 'none' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Canvas);
