import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm off-white, from the Soul Hues logo backdrop.
        cream: {
          DEFAULT: "#FAF8F3",
          alt: "#F5F2EC",
          deep: "#EFE7D6",
        },
        // Primary/secondary/accent sage green, per brand palette.
        sage: {
          DEFAULT: "#6F8F72",
          light: "#8FAE93",
          accent: "#B8D6B4",
          // Deeper computed sage used only where solid fills need
          // accessible contrast against cream/white text (buttons,
          // active states) -- keeps the same hue family as the brand
          // primary while meeting WCAG AA.
          dark: "#4F6B52",
        },
        // Text Primary / Text Secondary from the brand spec. "ink" is
        // reused as the deep section background (footer, testimonials)
        // since it's the darkest brand-safe tone and avoids true black.
        ink: {
          DEFAULT: "#2E3B2F",
          light: "#6A756B",
        },
        line: "#E8E2D8",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        script: ["var(--font-sacramento)", "cursive"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(46, 59, 47, 0.14)",
        lift: "0 20px 45px -15px rgba(46, 59, 47, 0.22)",
        sage: "0 8px 30px -10px rgba(111, 143, 114, 0.45)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 2.2s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      borderRadius: {
        xl2: "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
