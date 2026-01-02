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
                'sans': ['"Nunito Sans"', 'system-ui', 'sans-serif'],
                'serif': ['Raleway', 'sans-serif'], // Replacing serif with Raleway for headings mostly
                'heading': ['Raleway', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
