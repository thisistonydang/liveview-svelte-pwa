// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const fs = require("fs");
const path = require("path");

module.exports = {
  content: [
    "./js/**/*.{js,ts,svelte}",
    "./lib/**/*.{js,ts,svelte}",
    "./svelte/**/*.{js,ts,svelte}",
    "../lib/live_view_svelte_offline_demo_web.ex",
    "../lib/live_view_svelte_offline_demo_web/**/*.*ex",
  ],
  theme: {
    screens: {
      xs: "384px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        brand: "#FD4F00",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "fly-up": {
          from: { transform: "translate3d(0, 50px, 0)" },
          to: { transform: "translate3d(0, 0, 0)" },
        },
        "fly-down": {
          from: { transform: "translate3d(0, -50px, 0)" },
          to: { transform: "translate3d(0, 0, 0)" },
        },
        "fly-left": {
          from: { transform: "translate3d(50px, 0, 0)" },
          to: { transform: "translate3d(0, 0, 0)" },
        },
        "fly-right": {
          from: { transform: "translate3d(-50px, 0, 0)" },
          to: { transform: "translate3d(0, 0, 0)" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-15deg)" },
          "75%": { transform: "rotate(15deg)" },
        },
      },
    },
  },
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/forms"),
    // Allows prefixing tailwind classes with LiveView classes to add rules
    // only when LiveView classes are applied, for example:
    //
    //     <div class="phx-click-loading:animate-ping">
    //
    plugin(({ addVariant }) =>
      addVariant("phx-no-feedback", [".phx-no-feedback&", ".phx-no-feedback &"]),
    ),
    plugin(({ addVariant }) =>
      addVariant("phx-click-loading", [".phx-click-loading&", ".phx-click-loading &"]),
    ),
    plugin(({ addVariant }) =>
      addVariant("phx-submit-loading", [".phx-submit-loading&", ".phx-submit-loading &"]),
    ),
    plugin(({ addVariant }) =>
      addVariant("phx-change-loading", [".phx-change-loading&", ".phx-change-loading &"]),
    ),

    // Embeds Heroicons (https://heroicons.com) into your app.css bundle
    // See your `CoreComponents.icon/1` for more information.
    //
    plugin(function ({ matchComponents, theme }) {
      let iconsDir = path.join(__dirname, "./vendor/heroicons/optimized");
      let values = {};
      let icons = [
        ["", "/24/outline"],
        ["-solid", "/24/solid"],
        ["-mini", "/20/solid"],
      ];
      icons.forEach(([suffix, dir]) => {
        fs.readdirSync(path.join(iconsDir, dir)).forEach((file) => {
          let name = path.basename(file, ".svg") + suffix;
          values[name] = { name, fullPath: path.join(iconsDir, dir, file) };
        });
      });
      matchComponents(
        {
          hero: ({ name, fullPath }) => {
            let content = fs
              .readFileSync(fullPath)
              .toString()
              .replace(/\r?\n|\r/g, "");
            return {
              [`--hero-${name}`]: `url('data:image/svg+xml;utf8,${content}')`,
              "-webkit-mask": `var(--hero-${name})`,
              mask: `var(--hero-${name})`,
              "mask-repeat": "no-repeat",
              "background-color": "currentColor",
              "vertical-align": "middle",
              display: "inline-block",
              width: theme("spacing.5"),
              height: theme("spacing.5"),
            };
          },
        },
        { values },
      );
    }),
  ],
};
