'use client';
import React, { useState, useEffect } from 'react';

interface EventModalProps {
  isOpen: boolean;
  event: any; 
  onClose: () => void;
  onSave: (updatedEvent: any) => void; 
  onDelete: (eventId: number) => void; 
  isDarkMode: boolean; 
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, event, onClose, onSave, onDelete, isDarkMode }) => {
  const [title, setTitle] = useState(event ? event.title : '');
  const [start, setStart] = useState(event ? formatInputDateTime(event.start) : '');
  const [end, setEnd] = useState(event ? formatInputDateTime(event.end) : '');
  const [name, setName] = useState(event ? event.name : '');
  const [value, setValue] = useState(event ? event.value : '');
  
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStart(formatInputDateTime(event.start));
      setEnd(formatInputDateTime(event.end));
      setName(event.name)
      setValue(event.value)
    }
  }, [event]);


  // Função para formatar a data e hora, ajustando o fuso horário
  function formatInputDateTime(date: { getTime: () => number; getTimezoneOffset: () => number; }) {
    const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return adjustedDate.toISOString().slice(0, 16); // Formato "yyyy-MM-ddThh:mm"
  }

  const handleSave = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const updatedEvent = { ...event, title, start: new Date(start), end: new Date(end), name, value };
    onSave(updatedEvent);
    onClose(); // Fecha o modal após salvar
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      onClose(); // Fecha o modal após deletar
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`flex items-start justify-center absolute  opacity-95 z-50 h-screen w-full ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className={`p-6 rounded-md shadow-lg flex items-center justify-center flex-col md:mt-6 w-full h-full md:w-3/4 xl:w-2/4 md:h-4/5 ${isDarkMode ? 'bg-background text-text' : 'bg-background text-text'}`}>
        <h2 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Editar Evento</h2>
        <form onSubmit={handleSave} className='flex flex-col w-full gap-2 items-center justify-center'>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Nome do cliente'
            className={`p-3 rounded-sm border-none ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-black'}`}
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Serviço"
            required
            className={`p-3 rounded-md border-none ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-black'}`}
          />

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder='Valor'
            required
            className={`p-3 rounded-sm border-none ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-black'}`}
          />
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            className={`p-3 rounded-sm border-none ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-black'}`}
          />
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            className={`p-3 rounded-sm border-none ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-black'}`}
          />

          <div className='flex justify-center gap-6 items-center w-full'>
            <button type="submit" className={`px-4 py-2 mt-4 rounded ${isDarkMode ? 'bg-blue-500 hover:bg-blue-700' : 'bg-blue-300 hover:bg-blue-500'} text-white`}>
              Salvar
            </button>
            <button onClick={handleDelete} className={`px-4 py-2 mt-4 rounded ${isDarkMode ? 'bg-red-500 hover:bg-red-700' : 'bg-red-300 hover:bg-red-500'} text-white`}>
              Deletar
            </button>
            <button onClick={onClose} className={`px-4 py-2 mt-4 rounded ${isDarkMode ? 'bg-red-500 hover:bg-red-700' : 'bg-red-300 hover:bg-red-500'} text-white`}>
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
