/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				brand: '#3a4f64',
				primary: '#8b9bb7',
				secondary: '#b7c5d0',
				darkest: '#02060A',
				lightest: '#CCD6E0',
				dark: '#0D1B29',
				light: '#596E85',
				'gray-lightest': '#B0B9C2',
				'gray-darkest': '#8191A3',
			},
		},
	},
	plugins: [],
};
