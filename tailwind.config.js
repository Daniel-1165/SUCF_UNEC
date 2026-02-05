/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'vibrant-green': '#10b981',
                'light-green': '#ecfdf5',
                'mustard-gold': '#f59e0b',
                emerald: {
                    850: '#033f32',
                    950: '#022c22',
                },
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'serif': ['"Space Grotesk"', 'sans-serif'], // Using Space Grotesk for headings/serif slots
                'heading': ['"Space Grotesk"', 'sans-serif'],
            },
            boxShadow: {
                'zeni': '0 10px 40px rgba(0, 0, 0, 0.04)',
                'zeni-hover': '0 20px 60px rgba(0, 0, 0, 0.08)',
                'zeni-dark': '0 20px 60px rgba(0, 0, 0, 0.2)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'shine': 'shine 1.5s linear infinite',
                'fade-up': 'fadeUp 0.8s ease-out forwards',
                'spin-slow': 'spin 12s linear infinite',
                'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shine: {
                    '0%': { backgroundPosition: '200% center' },
                    '100%': { backgroundPosition: '-200% center' },
                },
                fadeUp: {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                glowPulse: {
                    'from': { boxShadow: '0 0 5px rgba(16, 185, 129, 0.2)' },
                    'to': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)' },
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #10b98133 0deg, #34d39933 180deg, #10b98133 360deg)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
