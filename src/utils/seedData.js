import { generateId, generateEmptyGrid } from './helpers';

const createGridFromStrings = (strings, colorMap) => {
  const height = strings.length;
  const width = strings[0].length;
  const grid = generateEmptyGrid(width, height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = strings[y][x];
      grid[y][x] = colorMap[char] || 'transparent';
    }
  }
  return grid;
};

// 1. Red Heart (16x16)
const HEART_STRINGS = [
  "                ",
  "   ####  ####   ",
  "  ###### ######  ",
  " ##############  ",
  " ##############  ",
  " ##############  ",
  "  ############   ",
  "   ##########    ",
  "    ########     ",
  "     ######      ",
  "      ####       ",
  "       ##        ",
  "                ",
  "                ",
  "                ",
  "                "
];

// 2. Golden Trophy (16x16)
const TROPHY_STRINGS = [
  "                ",
  "   #########    ",
  "  #         #   ",
  "  # ####### #   ",
  "  # ####### #   ",
  "   # ##### #    ",
  "    # ### #     ",
  "     # @ #      ",
  "      #@#       ",
  "     #####      ",
  "    #######     ",
  "                ",
  "                ",
  "                ",
  "                ",
  "                "
];

// 3. Emerald Gem (16x16)
const EMERALD_STRINGS = [
  "                ",
  "      ####      ",
  "     ######     ",
  "    ########    ",
  "   ##########   ",
  "  ############  ",
  " ############## ",
  "################",
  " ############## ",
  "  ############  ",
  "   ##########   ",
  "    ########    ",
  "     ######     ",
  "      ####      ",
  "                ",
  "                "
];

// 4. Creeper Face (16x16)
const CREEPER_STRINGS = [
  "                ",
  "   ##########   ",
  "   ##########   ",
  "   ##  ##  ##   ",
  "   ##  ##  ##   ",
  "   ####  ####   ",
  "   ####  ####   ",
  "     ######     ",
  "     ######     ",
  "     ##  ##     ",
  "     ##  ##     ",
  "   ##      ##   ",
  "   ##      ##   ",
  "   ##      ##   ",
  "                ",
  "                "
];

export const SEED_ARTWORKS = [
  {
    id: 'seed-heart-001',
    title: 'Pixel Heart',
    width: 16,
    height: 16,
    layers: [
      {
        id: 'layer-heart-1',
        name: 'Base',
        isVisible: true,
        grid: createGridFromStrings(HEART_STRINGS, { '#': '#ef4444' })
      }
    ],
    createdAt: new Date('2024-01-01').toISOString()
  },
  {
    id: 'seed-trophy-001',
    title: 'Golden Trophy',
    width: 16,
    height: 16,
    layers: [
      {
        id: 'layer-trophy-1',
        name: 'Base',
        isVisible: true,
        grid: createGridFromStrings(TROPHY_STRINGS, { '#': '#facc15', '@': '#eab308' })
      }
    ],
    createdAt: new Date('2024-01-02').toISOString()
  },
  {
    id: 'seed-emerald-001',
    title: 'Emerald Gem',
    width: 16,
    height: 16,
    layers: [
      {
        id: 'layer-emerald-1',
        name: 'Base',
        isVisible: true,
        grid: createGridFromStrings(EMERALD_STRINGS, { '#': '#10b981' })
      }
    ],
    createdAt: new Date('2024-01-03').toISOString()
  },
  {
    id: 'seed-creeper-001',
    title: 'Minecraft Creeper',
    width: 16,
    height: 16,
    layers: [
      {
        id: 'layer-creeper-1',
        name: 'Face',
        isVisible: true,
        grid: createGridFromStrings(CREEPER_STRINGS, { '#': '#22c55e' })
      }
    ],
    createdAt: new Date('2024-01-04').toISOString()
  }
];
