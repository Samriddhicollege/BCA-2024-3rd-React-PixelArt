import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateEmptyGrid, generateId } from '../utils/helpers';
import Canvas from '../components/features/Canvas';
import Toolbar from '../components/features/Toolbar';
import ColorPalette from '../components/features/ColorPalette';
import SaveModal from '../components/features/SaveModal';
import { FaPalette } from 'react-icons/fa';

const EditorPage = () => {
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(16);
  const [color, setColor] = useState('#3b82f6');
  const [activeTool, setActiveTool] = useState('brush'); // brush, eraser, fill
  const [eraserSize, setEraserSize] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [grid, setGrid] = useState(() => generateEmptyGrid(16, 16));

  const [savedArts, setSavedArts] = useLocalStorage('pixel-arts', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentId, setCurrentId] = useState(null);

  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const stateRef = useRef({ grid, undoHistory, redoHistory });
  const toolStateRef = useRef({ activeTool, color, width, height, eraserSize });
  const currentGridRef = useRef([]);
  const didMutateRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Load from gallery navigation or refresh via URL param
  useEffect(() => {
    if (id) {
      if (currentId !== id) {
        // Safe manual parse ensures we can read the ID independent of reactive savedArts state
        const storedArts = JSON.parse(window.localStorage.getItem('pixel-arts') || '[]');
        const art = storedArts.find((a) => a.id === id);
        
        if (art) {
          setWidth(art.width);
          setHeight(art.height);
          setGrid(art.grid);
          setCurrentId(art.id);
          setCurrentTitle(art.title);
          setUndoHistory([]);
          setRedoHistory([]);
          setHasUnsavedChanges(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          toast.error("Artwork not found!");
          navigate('/editor', { replace: true });
        }
      }
    } else {
      // If navigating to /editor with no ID but we were working on an art piece, wipe it cleanly to new
      if (currentId !== null || grid.length > 16 || undoHistory.length > 0) {
        setWidth(16);
        setHeight(16);
        const newGrid = generateEmptyGrid(16, 16);
        setGrid(newGrid);
        // Important: Ensure the direct mutation arrays match the newly minted empty grid 
        if (currentGridRef) { 
          currentGridRef.current = newGrid.map(row => [...row]);
        }
        setCurrentId(null);
        setCurrentTitle('');
        setUndoHistory([]);
        setRedoHistory([]);
        setHasUnsavedChanges(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [id, currentId, navigate]);

  useEffect(() => {
    stateRef.current = { grid, undoHistory, redoHistory };
    currentGridRef.current = grid.map(row => [...row]); // Keep mutable ref perfectly synced with React state boundary
  }, [grid, undoHistory, redoHistory]);

  useEffect(() => {
    toolStateRef.current = { activeTool, color, width, height, eraserSize };
  }, [activeTool, color, width, height, eraserSize]);

  const handleUndoAction = () => {
    const { grid: currentGrid, undoHistory: currentUndo, redoHistory: currentRedo } = stateRef.current;
    if (currentUndo.length === 0) return;
    
    const prevGrid = currentUndo[currentUndo.length - 1];
    const newUndo = currentUndo.slice(0, -1);
    const newRedo = [currentGrid, ...currentRedo];
    
    // Mutate ref instantly to safeguard against rapid Ctrl+Z firing before React commits
    stateRef.current = { grid: prevGrid, undoHistory: newUndo, redoHistory: newRedo };
    currentGridRef.current = prevGrid.map(row => [...row]);
    
    setUndoHistory(newUndo);
    setRedoHistory(newRedo);
    setGrid(prevGrid);
  };

  const handleRedoAction = () => {
    const { grid: currentGrid, undoHistory: currentUndo, redoHistory: currentRedo } = stateRef.current;
    if (currentRedo.length === 0) return;
    
    const nextGrid = currentRedo[0];
    const newRedo = currentRedo.slice(1);
    const newUndo = [...currentUndo, currentGrid];
    
    // Mutate ref instantly 
    stateRef.current = { grid: nextGrid, undoHistory: newUndo, redoHistory: newRedo };
    currentGridRef.current = nextGrid.map(row => [...row]);
    
    setRedoHistory(newRedo);
    setUndoHistory(newUndo);
    setGrid(nextGrid);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedoAction();
          } else {
            handleUndoAction();
          }
        } else if (e.key.toLowerCase() === 'y' || e.key.toLowerCase() === 'r') {
          e.preventDefault();
          handleRedoAction();
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          if (handleSaveClickRef.current) handleSaveClickRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setGrid(prevGrid => {
      const safeWidth = Math.max(1, Math.min(256, width));
      const safeHeight = Math.max(1, Math.min(256, height));

      const newGrid = generateEmptyGrid(safeWidth, safeHeight);
      for (let y = 0; y < Math.min(safeHeight, prevGrid.length); y++) {
        for (let x = 0; x < Math.min(safeWidth, prevGrid[0].length); x++) {
          newGrid[y][x] = prevGrid[y][x];
        }
      }
      setUndoHistory([]);
      setRedoHistory([]);
      return newGrid;
    });
  }, [width, height]);

  // Handle direct DOM mutation and ref mutation for blazing fast drawing performance (60FPS without React renders)
  const handleCellUpdate = useCallback((startY, startX) => {
    const { activeTool, color, width, height, eraserSize } = toolStateRef.current;
    if (!currentGridRef.current[startY]) return;

    const targetColor = currentGridRef.current[startY][startX] || 'transparent';
    const newColor = activeTool === 'fill' ? color : activeTool === 'brush' ? color : 'transparent';
    
    if (activeTool === 'fill') {
      if (targetColor === newColor) return; 
      didMutateRef.current = true;
      
      const stack = [[startY, startX]];
      
      while (stack.length > 0) {
        const [cy, cx] = stack.pop();
        if (cy < 0 || cy >= height || cx < 0 || cx >= width) continue;
        
        const currentColor = currentGridRef.current[cy][cx] || 'transparent';
        if (currentColor !== targetColor) continue;
        
        // Mutate Memory Ref
        currentGridRef.current[cy][cx] = newColor;
        // Mutate DOM Directly
        const el = document.getElementById(`cell-${cy}-${cx}`);
        if (el) el.style.backgroundColor = newColor;
        
        stack.push([cy + 1, cx]);
        stack.push([cy - 1, cx]);
        stack.push([cy, cx + 1]);
        stack.push([cy - 1, cx - 1]);
      }
    } else {
      if (activeTool === 'eraser' && eraserSize > 1) {
        didMutateRef.current = true;
        const offset = Math.floor(eraserSize / 2);
        const evenOffset = eraserSize % 2 === 0 ? offset - 1 : offset;
        
        for (let dy = -evenOffset; dy <= offset; dy++) {
          for (let dx = -evenOffset; dx <= offset; dx++) {
            const cy = startY + dy;
            const cx = startX + dx;
            
            if (cy >= 0 && cy < height && cx >= 0 && cx < width) {
              const el = document.getElementById(`cell-${cy}-${cx}`);
              if (currentGridRef.current[cy][cx] !== newColor) {
                 currentGridRef.current[cy][cx] = newColor;
                 if (el) el.style.backgroundColor = newColor;
              }
            }
          }
        }
      } else {
        if (targetColor === newColor) return;
        didMutateRef.current = true;
        
        // Mutate Memory Ref
        currentGridRef.current[startY][startX] = newColor;
        
        // Mutate DOM Directly
        const el = document.getElementById(`cell-${startY}-${startX}`);
        if (el) el.style.backgroundColor = newColor;
      }
    }
  }, []);

  // Sync back to React state whenever the user lifts their mouse button to solidify history and saves
  const handleStrokeEnd = useCallback(() => {
    if (didMutateRef.current) {
      didMutateRef.current = false;
      setHasUnsavedChanges(true);
      
      setGrid(prevGrid => {
        const newGrid = currentGridRef.current.map(r => [...r]);
        setUndoHistory(history => [...history, prevGrid]);
        setRedoHistory([]);
        return newGrid;
      });
    }
  }, []);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      setUndoHistory(h => [...h, grid]);
      setRedoHistory([]);
      setGrid(generateEmptyGrid(width, height));
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveClickRef = useRef(null);

  const handleSaveClick = useCallback(() => {
    if (currentId) {
      // Sliently overwrite existing file
      const updatedArt = {
        id: currentId,
        title: currentTitle,
        width,
        height,
        grid,
        updatedAt: new Date().toISOString()
      };
      
      setSavedArts(prev => prev.map(art => art.id === currentId ? { ...art, ...updatedArt } : art));
      setHasUnsavedChanges(false);
      toast.success(`Artwork "${currentTitle}" saved!`);
    } else {
      setIsModalOpen(true);
    }
  }, [currentId, currentTitle, width, height, grid, setSavedArts]);

  useEffect(() => {
    handleSaveClickRef.current = handleSaveClick;
  }, [handleSaveClick]);

  const handleSave = (title) => {
    const newId = generateId();
    const newArt = {
      id: newId,
      title,
      width,
      height,
      grid,
      createdAt: new Date().toISOString()
    };
    setSavedArts(prev => [newArt, ...prev]);
    setIsModalOpen(false);
    setCurrentId(newId);
    setCurrentTitle(title);
    setHasUnsavedChanges(false);
    toast.success(`Artwork "${title}" saved successfully!`);
    navigate(`/editor/${newId}`, { replace: true });
  };

  return (
    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', color: 'transparent', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <FaPalette style={{ color: '#60a5fa' }} /> Editor
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {currentTitle ? `Editing: ${currentTitle}` : 'Create beautiful pixel art securely stored in your browser'}
          {hasUnsavedChanges && (
            <span 
              title="Unsaved changes"
              style={{ 
                display: 'inline-block', 
                width: '10px', 
                height: '10px', 
                backgroundColor: 'var(--primary)', 
                borderRadius: '50%', 
                marginLeft: '10px',
                verticalAlign: 'middle',
                boxShadow: '0 0 5px var(--primary)'
              }} 
            />
          )}
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
          <Toolbar 
            activeTool={activeTool} 
            setActiveTool={setActiveTool}
            eraserSize={eraserSize}
            setEraserSize={setEraserSize}
            onUndo={handleUndoAction}
            onRedo={handleRedoAction}
            canUndo={undoHistory.length > 0}
            canRedo={redoHistory.length > 0}
            onClear={handleClear}
            onSave={handleSaveClick}
          />
        </aside>

        <section className="editor-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
          <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
            <Canvas
              grid={grid}
              onCellUpdate={handleCellUpdate}
              onStrokeEnd={handleStrokeEnd}
            />
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px', flexShrink: 0 }}>
          <ColorPalette color={color} onColorChange={setColor} />
          <div className="color-palette-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 className="palette-title">Canvas Size</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Width (1-256)</label>
                <input 
                  type="number" 
                  value={width} 
                  onChange={(e) => { setWidth(Number(e.target.value)); setHasUnsavedChanges(true); }}
                  min="1" max="256"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Height (1-256)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => { setHeight(Number(e.target.value)); setHasUnsavedChanges(true); }}
                  min="1" max="256"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                />
              </div>
            </div>
          </div>
        </aside>
      </main>

      <SaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialTitle={currentTitle}
      />
    </div>
  );
};

export default EditorPage;
