module.exports = {
	darkMode: ['class'],
	content: [
	  './index.html', // Arquivo HTML
	  './src/**/*.{ts,tsx,js,jsx}', // Incluindo todos os arquivos JS, JSX, TS, TSX
	],
	theme: {
	  extend: {
		colors: {
		  background: 'var(--background)',
		  card: 'var(--card)',
		  paragraph: 'var(--paragraph)',
		  button: 'var(--button)',
		  buttonText: 'var(--buttonText)',
		  buttonHover: 'var(--buttonHover)',
		  text: 'var(--text)',
		  link: 'var(--link)',
		  input: 'var(--input)',
		  today: 'var(--today)',
		  month: 'var(--month)',
		  defaultMonth: 'var(--defaultMonth)',
		  buttonCalenderHover: 'var(--buttonCalenderHover)',
		  cardButtonHeader: 'var(--cardButtonHeader)',
		},
		fontFamily:{
			poppins: ['Poppins'],
		  }
	  },
	  
	},
	plugins: [require('tailwindcss-animate')],
  };
  