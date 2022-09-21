/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-fast": "spin 0.45s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
