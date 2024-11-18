'use client';
import React, { useState } from 'react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newEvent: { title: string; start: string; end: string }) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSave = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (title && start && end) {
      const newEvent = { title, start, end };
      onSave(newEvent);
      setTitle('')
      setStart('')
      setEnd('')
      onClose(); // Fecha o modal após salvar
      
   
    } else {
      alert("Preencha todos os campos.");
    }
    
  };

  if (!isOpen) return null;

  return (
    <div className="flex items-start justify-center bg-black absolute opacity-90 z-50 h-screen w-full">
      <div className="bg-slate-950 p-6 rounded-md shadow-lg flex items-center justify-center flex-col mt-6 w-2/4 h-3/4">
        <h2 className="text-white text-lg mb-4">Criar Novo Evento</h2>
        <form onSubmit={handleSave} className="flex flex-col w-2/4 gap-2 items-center justify-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do Evento"
            required
            className="p-3 rounded-md border-none"
          />
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            className="p-3 rounded-sm border-none"
          />
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            className="p-3 rounded-sm border-none"
          />
          <div className="flex justify-around items-center w-full">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-gray-800">
              Salvar
            </button>
            <button onClick={onClose} className="text-white bg-red-500 px-4 py-2 rounded hover:bg-gray-800 mt-4">
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
