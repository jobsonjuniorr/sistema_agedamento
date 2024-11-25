'use client';
import React, { useState } from 'react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newEvent: { title: string; start: string; end: string }) => void;
  isDarkMode: boolean;  // Recebe o estado do modo escuro do componente pai
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSave, isDarkMode }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSave = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (title && start && end) {
      const newEvent = { title, start, end };
      onSave(newEvent);
      setTitle('');
      setStart('');
      setEnd('');
      onClose(); // Fecha o modal após salvar
    } else {
      alert('Preencha todos os campos.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`flex items-start justify-center absolute opacity-95 z-50 h-screen w-full ${
        isDarkMode ? 'bg-black' : 'bg-white'
      }`}
    >
      <div
        className={`${
          isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-100 text-black'
        } p-6 rounded-md shadow-lg flex items-center justify-center flex-col mt-6 w-2/4 h-3/4`}
      >
        <h2 className="text-lg mb-4">Criar Novo Evento</h2>
        <form onSubmit={handleSave} className="flex flex-col w-2/4 gap-2 items-center justify-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do Evento"
            required
            className={`p-3 rounded-md border-none ${
              isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-black'
            }`}
          />
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            className={`p-3 rounded-sm border-none ${
              isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-black'
            }`}
          />
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            className={`p-3 rounded-sm border-none ${
              isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-black'
            }`}
          />
          <div className="flex justify-around items-center w-full">
            <button
              type="submit"
              className={`${
                isDarkMode ? 'bg-blue-500 hover:bg-blue-700' : 'bg-blue-300 hover:bg-blue-500'
              } text-white px-4 py-2 mt-4 rounded`}
            >
              Salvar
            </button>
            <button
              onClick={onClose}
              className={`${
                isDarkMode ? 'bg-red-500 hover:bg-red-700' : 'bg-red-300 hover:bg-red-500'
              } text-white px-4 py-2 rounded mt-4`}
            >
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
