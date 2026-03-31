import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateEmptyGrid, generateId } from '../utils/helpers';
import Canvas from '../components/features/Canvas';
import Toolbar from '../components/features/Toolbar';
import ColorPalette from '../components/features/ColorPalette';
import LayerPanel from '../components/features/LayerPanel';
import SaveModal from '../components/features/SaveModal';
import { FaPalette } from 'react-icons/fa';
import { SEED_ARTWORKS } from '../utils/seedData';
import './EditorPage.css';

const EditorPage = () => {
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(16);
  const [color, setColor] = useState('#3b82f6');
  const [activeTool, setActiveTool] = useState('brush'); // brush, eraser, fill
  const [eraserSize, setEraserSize] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [layers, setLayers] = useState(() => [
    { id: generateId(), name: 'Layer 1', isVisible: true, grid: generateEmptyGrid(16, 16) }
  ]);
  const [activeLayerId, setActiveLayerId] = useState(() => layers[0].id);

  const [savedArts, setSavedArts] = useLocalStorage('pixel-arts', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentId, setCurrentId] = useState(null);

  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const stateRef = useRef({ layers, undoHistory, redoHistory });
  const toolStateRef = useRef({ activeTool, color, width, height, eraserSize, activeLayerId });
  const currentGridRef = useRef([]);
  const canvasBufferRef = useRef([]);
  const didMutateRef = useRef(false);
  const resizeTimeoutRef = useRef(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Load from gallery navigation or refresh via URL param
  useEffect(() => {
    if (id) {
      if (currentId !== id) {
        // Safe manual parse ensures we can read the ID independent of reactive savedArts state
        const storedArts = JSON.parse(window.localStorage.getItem('pixel-arts') || '[]');
        let art = storedArts.find((a) => a.id === id);

        if (!art) {
          art = SEED_ARTWORKS.find((a) => a.id === id);
        }

        if (art) {
          setWidth(art.width);
          setHeight(art.height);
          
          // Migration/Fallback for old single-grid saves
          const loadedLayers = art.layers || [
            { id: generateId(), name: 'Layer 1', isVisible: true, grid: art.grid }
          ];
          setLayers(loadedLayers);
          setActiveLayerId(loadedLayers[0].id);
          
          const activeGrid = loadedLayers.find(l => l.id === loadedLayers[0].id).grid;
          currentGridRef.current = activeGrid.map(row => [...row]);
          canvasBufferRef.current = activeGrid.map(row => [...row]);
          
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
      if (currentId !== null || layers.length > 1 || undoHistory.length > 0) {
        setWidth(16);
        setHeight(16);
        const newGrid = generateEmptyGrid(16, 16);
        const initialLayers = [{ id: generateId(), name: 'Layer 1', isVisible: true, grid: newGrid }];
        setLayers(initialLayers);
        setActiveLayerId(initialLayers[0].id);
        
        currentGridRef.current = newGrid.map(row => [...row]);
        canvasBufferRef.current = newGrid.map(row => [...row]);
        
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
    stateRef.current = { layers, undoHistory, redoHistory };
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (activeLayer) {
      currentGridRef.current = activeLayer.grid.map(row => [...row]);
    }
  }, [layers, undoHistory, redoHistory, activeLayerId]);

  useEffect(() => {
    toolStateRef.current = { activeTool, color, width, height, eraserSize, activeLayerId };
  }, [activeTool, color, width, height, eraserSize, activeLayerId]);

  const handleUndoAction = () => {
    const { layers: currentLayers, undoHistory: currentUndo, redoHistory: currentRedo } = stateRef.current;
    if (currentUndo.length === 0) return;

    const prevLayers = currentUndo[currentUndo.length - 1];
    const newUndo = currentUndo.slice(0, -1);
    const newRedo = [currentLayers, ...currentRedo];

    // Mutate ref instantly to safeguard against rapid Ctrl+Z firing before React commits
    stateRef.current = { layers: prevLayers, undoHistory: newUndo, redoHistory: newRedo };
    
    const activeLayer = prevLayers.find(l => l.id === activeLayerId) || prevLayers[0];
    currentGridRef.current = activeLayer.grid.map(row => [...row]);
    canvasBufferRef.current = activeLayer.grid.map(row => [...row]);

    setWidth(activeLayer.grid[0]?.length || 16);
    setHeight(activeLayer.grid.length || 16);
    setUndoHistory(newUndo);
    setRedoHistory(newRedo);
    setLayers(prevLayers);
    if (!prevLayers.find(l => l.id === activeLayerId)) {
      setActiveLayerId(prevLayers[0].id);
    }
  };

  const handleRedoAction = () => {
    const { layers: currentLayers, undoHistory: currentUndo, redoHistory: currentRedo } = stateRef.current;
    if (currentRedo.length === 0) return;

    const nextLayers = currentRedo[0];
    const newRedo = currentRedo.slice(1);
    const newUndo = [...currentUndo, currentLayers];

    // Mutate ref instantly 
    stateRef.current = { layers: nextLayers, undoHistory: newUndo, redoHistory: newRedo };
    
    const activeLayer = nextLayers.find(l => l.id === activeLayerId) || nextLayers[0];
    currentGridRef.current = activeLayer.grid.map(row => [...row]);
    canvasBufferRef.current = activeLayer.grid.map(row => [...row]);

    setWidth(activeLayer.grid[0]?.length || 16);
    setHeight(activeLayer.grid.length || 16);
    setRedoHistory(newRedo);
    setUndoHistory(newUndo);
    setLayers(nextLayers);
    if (!nextLayers.find(l => l.id === activeLayerId)) {
      setActiveLayerId(nextLayers[0].id);
    }
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

  const handleDimensionChange = useCallback((newWidth, newHeight) => {
    const sw = Math.max(1, Math.min(256, newWidth));
    const sh = Math.max(1, Math.min(256, newHeight));

    // Update width/height stats instantly for responsive UI labels and sliders
    setWidth(sw);
    setHeight(sh);

    // Debounce the very expensive grid resize which forces a heavy React re-render of thousands of cells
    if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);

    resizeTimeoutRef.current = setTimeout(() => {
      setLayers(prevLayers => {
        return prevLayers.map(layer => {
          const buffer = layer.grid; // Or use a global buffer if needed, but per-layer is safer
          const newGrid = generateEmptyGrid(sw, sh);

          for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
              if (buffer[y] && buffer[y][x]) {
                newGrid[y][x] = buffer[y][x];
              }
            }
          }
          return { ...layer, grid: newGrid };
        });
      });
      setHasUnsavedChanges(true);
    }, 200); // 200ms provides a good balance between responsiveness and smoothness
  }, []);

  // Handle direct DOM mutation and ref mutation for blazing fast drawing performance (60FPS without React renders)
  const handleCellUpdate = useCallback((startY, startX) => {
    const { activeTool, color, width, height, eraserSize, activeLayerId } = toolStateRef.current;
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
        const el = document.getElementById(`cell-${activeLayerId}-${cy}-${cx}`);
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
              const el = document.getElementById(`cell-${activeLayerId}-${cy}-${cx}`);
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
        const el = document.getElementById(`cell-${activeLayerId}-${startY}-${startX}`);
        if (el) el.style.backgroundColor = newColor;
      }
    }
  }, []);

  // Sync back to React state whenever the user lifts their mouse button to solidify history and saves
  const handleStrokeEnd = useCallback(() => {
    if (didMutateRef.current) {
      didMutateRef.current = false;
      setHasUnsavedChanges(true);

      setLayers(prevLayers => {
        const newLayers = prevLayers.map(layer => {
          if (layer.id === activeLayerId) {
            return { ...layer, grid: currentGridRef.current.map(r => [...r]) };
          }
          return layer;
        });

        setUndoHistory(history => [...history, prevLayers]);
        setRedoHistory([]);
        return newLayers;
      });
    }
  }, [activeLayerId]);

  const handleClear = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the active layer?")) {
      setUndoHistory(h => [...h, layers]);
      setRedoHistory([]);
      setLayers(prev => prev.map(l => l.id === activeLayerId ? { ...l, grid: generateEmptyGrid(width, height) } : l));
      setHasUnsavedChanges(true);
    }
  }, [layers, activeLayerId, width, height]);

  const addLayer = useCallback(() => {
    const newLayer = {
      id: generateId(),
      name: `Layer ${layers.length + 1}`,
      isVisible: true,
      grid: generateEmptyGrid(width, height)
    };
    setUndoHistory(h => [...h, layers]);
    setRedoHistory([]);
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
    setHasUnsavedChanges(true);
    toast.success("New layer added");
  }, [layers, width, height]);

  const deleteLayer = useCallback((layerId) => {
    if (layers.length <= 1) {
      toast.error("Cannot delete the only layer");
      return;
    }
    if (window.confirm("Are you sure you want to delete this layer?")) {
      setUndoHistory(h => [...h, layers]);
      setRedoHistory([]);
      const newLayers = layers.filter(l => l.id !== layerId);
      setLayers(newLayers);
      if (activeLayerId === layerId) {
        setActiveLayerId(newLayers[newLayers.length - 1].id);
      }
      setHasUnsavedChanges(true);
      toast.success("Layer deleted");
    }
  }, [layers, activeLayerId]);

  const toggleLayerVisibility = useCallback((layerId) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, isVisible: !l.isVisible } : l));
  }, []);

  const renameLayer = useCallback((layerId, newName) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, name: newName } : l));
  }, []);

  const handleSaveClickRef = useRef(null);

  const handleSaveClick = useCallback(() => {
    if (currentId) {
      // Sliently overwrite existing file
      const updatedArt = {
        id: currentId,
        title: currentTitle,
        width,
        height,
        layers: layers.map(l => l.id === activeLayerId ? { ...l, grid: currentGridRef.current.map(row => [...row]) } : l),
        updatedAt: new Date().toISOString()
      };

      setSavedArts(prev => prev.map(art => art.id === currentId ? { ...art, ...updatedArt } : art));
      setHasUnsavedChanges(false);
    } else {
      setIsModalOpen(true);
    }
  }, [currentId, currentTitle, width, height, setSavedArts]);

  useEffect(() => {
    handleSaveClickRef.current = handleSaveClick;
  }, [handleSaveClick]);

  const handleSave = (title) => {
    const newId = generateId();
    const updatedLayers = layers.map(l => l.id === activeLayerId ? { ...l, grid: currentGridRef.current.map(row => [...row]) } : l);
    const newArt = {
      id: newId,
      title,
      width,
      height,
      layers: updatedLayers,
      createdAt: new Date().toISOString()
    };
    setSavedArts(prev => [newArt, ...prev]);
    setIsModalOpen(false);
    setCurrentId(newId);
    setCurrentTitle(title);
    setLayers(updatedLayers); // Sync grid state with the saved data
    setHasUnsavedChanges(false);
    toast.success(`Artwork "${title}" saved successfully!`);
    navigate(`/editor/${newId}`, { replace: true });
  };

  return (
    <div className="editor-page-container">
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

      <main className="editor-main-content">
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
            canvasWidth={width}
            canvasHeight={height}
            onWidthChange={(v) => handleDimensionChange(v, height)}
            onHeightChange={(v) => handleDimensionChange(width, v)}
            color={color}
            onColorChange={setColor}
            onResetDimensions={() => handleDimensionChange(16, 16)}
          />
        </aside>

        <section className="editor-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
          <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
            <Canvas
              layers={layers}
              activeLayerId={activeLayerId}
              onCellUpdate={handleCellUpdate}
              onStrokeEnd={handleStrokeEnd}
              activeTool={activeTool}
              eraserSize={eraserSize}
            />
          </div>
        </section>

        <aside className="sidebar-palette-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px', flexShrink: 0 }}>
          <ColorPalette color={color} onColorChange={setColor} />
          <LayerPanel
            layers={layers}
            activeLayerId={activeLayerId}
            onSelectLayer={setActiveLayerId}
            onAddLayer={addLayer}
            onDeleteLayer={deleteLayer}
            onToggleVisibility={toggleLayerVisibility}
            onRenameLayer={renameLayer}
          />
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
