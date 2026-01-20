/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                'bebas': ['Bebas Neue', 'sans-serif'],
                'inter': ['Inter', 'sans-serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    dark: 'hsl(var(--primary-dark))',
                    light: 'hsl(var(--primary-light))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))'
                },
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    foreground: 'hsl(var(--warning-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                dashboard: {
                    header: 'hsl(var(--dashboard-header))',
                    panel: 'hsl(var(--dashboard-panel))',
                    border: 'hsl(var(--dashboard-border))',
                    label: 'hsl(var(--dashboard-label))',
                    value: 'hsl(var(--dashboard-value))'
                },
                category: {
                    super: 'hsl(var(--category-super))',
                    typhoon: 'hsl(var(--category-typhoon))',
                    severe: 'hsl(var(--category-severe))',
                    storm: 'hsl(var(--category-storm))',
                    depression: 'hsl(var(--category-depression))',
                    low: 'hsl(var(--category-low))'
                }
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'pulse-glow': {
                    '0%, 100%': { 
                        boxShadow: '0 0 5px hsl(var(--secondary) / 0.5)'
                    },
                    '50%': { 
                        boxShadow: '0 0 20px hsl(var(--secondary) / 0.8)'
                    }
                },
                'slide-in': {
                    from: { 
                        opacity: '0',
                        transform: 'translateX(-10px)'
                    },
                    to: { 
                        opacity: '1',
                        transform: 'translateX(0)'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'slide-in': 'slide-in 0.3s ease-out'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
