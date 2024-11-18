'use client';
import React, { useState, useEffect } from 'react';

interface EventModalProps {
  isOpen: boolean;
  event: any; // Substitua 'any' por um tipo específico para o seu evento
  onClose: () => void;
  onSave: (updatedEvent: any) => void; // Substitua 'any' pelo tipo correto
  onDelete: (eventId: number) => void; // Substitua 'number' pelo tipo correto
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, event, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(event ? event.title : '');
  const [start, setStart] = useState(event ? formatInputDateTime(event.start) : '');
  const [end, setEnd] = useState(event ? formatInputDateTime(event.end) : '');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStart(formatInputDateTime(event.start));
      setEnd(formatInputDateTime(event.end));
    }
  }, [event]);

  // Função para formatar a data e hora, ajustando o fuso horário
  function formatInputDateTime(date: { getTime: () => number; getTimezoneOffset: () => number; }) {
    const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return adjustedDate.toISOString().slice(0, 16); // Formato "yyyy-MM-ddThh:mm"
  }

  const handleSave = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const updatedEvent = { ...event, title, start: new Date(start), end: new Date(end) };
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
    <div className="flex items-start justify-center bg-black absolute opacity-90 z-50 h-screen w-full">
      <div className="bg-slate-950 p-6 rounded-md shadow-lg flex items-center justify-center flex-col mt-6 w-3/4 h-3/4">
        <h2 className='text-white text-lg mb-4'>Editar Evento</h2>
        <form onSubmit={handleSave} className='flex flex-col w-full gap-2 items-center justify-center ' >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do Evento"
            required
            className='p-3 rounded-md border-none' 
          />
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            className=' p-3 rounded-sm border-none'
          />
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            className=' p-3 rounded-sm border-none '
          />
          
        <div className='flex justify-center gap-6 items-center w-full  '>

        <button type="submit" className='bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-gray-800 '>Salvar</button>

        <button onClick={handleDelete} className='bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-gray-800 '>Deletar</button>
        
        <button onClick={onClose} className='text-white bg-red-500 px-4 py-2 rounded hover:bg-gray-800 mt-4'>Fechar</button>

        </div>
        </form>
       
      </div>
    </div>
  );
};

export default EventModal;
