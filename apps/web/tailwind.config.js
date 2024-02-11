const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        dedoc: {
          "base-100": "#0D0E18",
          "base-200": "#151624",
          "base-300": "#191B2D",
          "base-content": "#9E9FA3",
          "primary": "#FFFFFF",
          "neutral-content": "#9E9FA3",

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem"
        }
      }
    ],
  },
  colors: {
    "base-400": "#232538"
  }
};
