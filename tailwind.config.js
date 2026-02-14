/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-green': '#064e3b',
                'vibrant-green': '#10b981',
                'light-green': '#ecfdf5',
                'mustard-gold': '#f59e0b',
            },
            fontFamily: {
                'sans': ['"Outfit"', 'Inter', 'system-ui', 'sans-serif'],
                'serif': ['"Libre Baskerville"', 'serif'],
                'heading': ['"Outfit"', 'sans-serif'],
            },
            boxShadow: {
                'zeni': '0 8px 30px rgba(0, 0, 0, 0.04)',
                'zeni-hover': '0 20px 60px rgba(0, 0, 0, 0.08)',
                'zeni-dark': '0 20px 60px rgba(0, 0, 0, 0.2)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
