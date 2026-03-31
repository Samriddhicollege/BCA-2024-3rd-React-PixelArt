// Generate an empty grid of size width x height with a default color
export const generateEmptyGrid = (width, height, defaultColor = 'transparent') => {
  return Array(height).fill(null).map(() => 
    Array(width).fill(defaultColor)
  );
};

// Generate a random ID for saved artworks
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// Format a date string
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

// Composite multiple layers into a single grid
export const compositeLayers = (layers) => {
  if (!layers || !layers.length) return [];
  const height = layers[0].grid.length;
  const width = layers[0].grid[0].length;
  const composite = generateEmptyGrid(width, height);

  layers.forEach(layer => {
    if (!layer.isVisible) return;
    layer.grid.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color && color !== 'transparent') {
          composite[y][x] = color;
        }
      });
    });
  });

  return composite;
};

// Export the grid or layers as a PNG image
export const exportToPNG = (data, title = 'pixel-art', scale = 20) => {
  // If data is an array of layers, composite them first
  const grid = Array.isArray(data) && data[0]?.grid ? compositeLayers(data) : data;
  
  if (!grid || !grid.length) return;

  const height = grid.length;
  const width = grid[0].length;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');

  grid.forEach((row, y) => {
    row.forEach((color, x) => {
      if (color && color !== 'transparent') {
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      } else {
        ctx.clearRect(x * scale, y * scale, scale, scale);
      }
    });
  });

  const link = document.createElement('a');
  link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};
