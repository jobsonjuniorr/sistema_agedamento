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
		  borderText: 'var(--borderText)'
		},
		fontFamily:{
			poppins: ['Poppins'],
		  },
		keyframes:{
			cardAnimationRight: {
				'0%' : {opacity:'0',transform:'translateX(95px)'},
				'100%':{opacity:'1',transform:'translateX(0)'},
			},
			cardAnimationLeft: {
				'0%' : {opacity:'0',transform:'translateX(-95px)'},
				'100%':{opacity:'1',transform:'translateX(0)'},
			},
			opactiy: {
				'0%':{ opacity:'0'},
				'50%':{opacity:'0.5'},
				'100%':{ opacity:'1'},
			},
		},
		animation:{
			cardanimationRight:'cardAnimationRight 1s ease-out forwards',
			cardanimationLeft:'cardAnimationLeft 1.3s ease-out forwards',
			opactiyCard: 'opactiy 2s ease-out forwards' 
		}
	  },
	  
	},
	plugins: [require('tailwindcss-animate')],
  };
  