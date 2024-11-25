import React from 'react';
import { useTheme } from '@/theremcontext.tsx'; // Verifique o caminho correto
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons'

const ThemeToggleButton: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button className='bg-button text-text p-1 w-24 2xl:w-40 2xl:text-2xl 2xl:p-3 md:p-2 md:w-28 rounded text-lg duration-200 hover:bg-buttonHover' onClick={toggleTheme}>
      {isDarkMode ? <FontAwesomeIcon icon={faSun} color='#fff'/>
      
      :
       <FontAwesomeIcon icon={faMoon} color='#00473e'/>}
    </button>
  );
};

export default ThemeToggleButton;
