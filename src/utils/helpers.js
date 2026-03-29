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

// Export the grid as a PNG image
export const exportToPNG = (grid, title = 'pixel-art', scale = 20) => {
  if (!grid || !grid.length) return;

  const height = grid.length;
  const width = grid[0].length;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');

  grid.forEach((row, y) => {
    row.forEach((color, x) => {
      ctx.fillStyle = color || 'transparent';
      if (color === 'transparent') {
        // Use a clear rectangle for transparent pixels
        ctx.clearRect(x * scale, y * scale, scale, scale);
      } else {
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    });
  });

  const link = document.createElement('a');
  link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};
