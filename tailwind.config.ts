import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2563EB',
					50: '#EFF6FF',
					100: '#DBEAFE',
					500: '#2563EB',
					600: '#1D4ED8',
					700: '#1E40AF',
					900: '#1E3A8A',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					orange: '#F97316',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Modern neutral palette inspired by Linear/Notion
				gray: {
					25: '#FCFCFD',
					50: '#F8FAFC',
					100: '#F1F5F9',
					200: '#E2E8F0',
					300: '#CBD5E1',
					400: '#94A3B8',
					500: '#64748B',
					600: '#475569',
					700: '#334155',
					800: '#1E293B',
					900: '#0F172A',
					950: '#020617'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
				'medium': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
				'large': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
				'glow': '0 0 20px rgba(37, 99, 235, 0.15)',
				'inner-soft': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
			},
			backdropBlur: {
				xs: '2px'
			},
			keyframes: {
				// Existing animations
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				// Modern micro-interactions
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(8px)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-in-from-top': {
					'0%': { opacity: '0', transform: 'translateY(-12px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-from-bottom': {
					'0%': { opacity: '0', transform: 'translateY(12px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.2s ease-out',
				'fade-out': 'fade-out 0.2s ease-out',
				'scale-in': 'scale-in 0.15s ease-out',
				'slide-in-from-top': 'slide-in-from-top 0.2s ease-out',
				'slide-in-from-bottom': 'slide-in-from-bottom 0.2s ease-out',
				'shimmer': 'shimmer 2s infinite',
				'pulse-soft': 'pulse-soft 2s infinite'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem'
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
			},
			transitionTimingFunction: {
				'bounce-subtle': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				'ease-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Add custom utilities
		function({ addUtilities }: any) {
			addUtilities({
				'.glass': {
					'backdrop-filter': 'blur(12px) saturate(180%)',
					'background-color': 'rgba(255, 255, 255, 0.05)',
					'border': '1px solid rgba(255, 255, 255, 0.1)'
				},
				'.glass-dark': {
					'backdrop-filter': 'blur(12px) saturate(180%)',
					'background-color': 'rgba(0, 0, 0, 0.05)',
					'border': '1px solid rgba(255, 255, 255, 0.05)'
				},
				'.gradient-border': {
					'background': 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #2563EB, #7C3AED) border-box',
					'border': '1px solid transparent'
				}
			})
		}
	],
} satisfies Config;
