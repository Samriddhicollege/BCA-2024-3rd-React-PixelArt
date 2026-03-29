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
