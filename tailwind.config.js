module.exports = {
    corePlugins: {
        preflight: false,
    },
    important: "#delivery-widget",
    purge: ["./src/**/*.ts", "./src/**/*.tsx"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            textColor: {
                primary: "var(--text-primary)",
                secondary: "var(--text-secondary)",
                decent: "var(--text-decent)",
                accent: "var(--text-accent)",
                danger: "var(--text-danger)",
            },
            backgroundColor: {
                primary: "var(--bg-primary)",
                secondary: "var(--bg-secondary)",
                decent: "var(--text-decent)",
                accent: "var(--bg-accent)",
                "accent-hover": "var(--bg-accent-hover)",
                active: "var(--bg-active)",
            },
            borderColor: {
                DEFAULT: "var(--border-default)",
                secondary: "var(--border-secondary)",
                accent: "var(--border-accent)",
                "accent-hover": "var(--border-accent-hover)",
            },
            ringColor: {
                accent: "var(--ring-accent)",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
