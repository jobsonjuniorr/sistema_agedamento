
'use client';
import React from 'react';

interface EventPopupProps {
  isOpen: boolean;
  events: { id: number; title: string; start: Date; end: Date }[];
  onClose: () => void;
  onSelectEvent: (event: { id: number; title: string; start: Date; end: Date }) => void;
  isDarkMode : boolean; 
}

const EventPopup: React.FC<EventPopupProps> = ({ isOpen, events, onClose, onSelectEvent, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="flex items-start justify-center bg-black absolute opacity-90 z-50 h-screen w-full">
      <div className={`${isDarkMode ?'bg-background text': 'bg-background text-text'} p-6 rounded-md shadow-lg flex items-center justify-center flex-col md:mt-6 md:w-3/4 w-full h-full  xl:w-2/4 md:h-3/4`}>
        <h2 className={`${isDarkMode? 'text-text': 'text-text'} text-lg mb-4`}>Eventos Existentes</h2>
        <ul className="w-full text-white flex flex-col gap-2">
          {events.map((event) => (
            <li
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className = {`cursor-pointer hover:bg-buttonCalenderHover p-2 rounded ${isDarkMode? 'text-text': 'text-text'}`}
            >
              {event.title} ({new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()})
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-gray-800">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default EventPopup;
