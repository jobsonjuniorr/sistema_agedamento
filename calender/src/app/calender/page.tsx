'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import {enUS, ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventModal from '@/components/popup'; // Modal para editar eventos
import CreateEventModal from '@/components/create-event-modal'; // Modal para criar eventos
import EventPopup from '@/components/schedules'; // Popup de eventos ocultos

const locales = {
  'en-Us': enUS,
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

const CalendarStructure: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [showMoreEvents, setShowMoreEvents] = useState<Event[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/events');
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }
      const data = await response.json();
  
      // Certificar que os eventos têm o formato correto
      const formattedEvents = data.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
  
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };
  
  const addOrUpdateEvent = async (updatedEvent: { title: string; start: string; end: string }) => {
    const { title, start, end } = updatedEvent;
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      try {
        if (selectedEvent) {
          // Atualizar evento existente
          const updatedEvents = events.map(event =>
            event.id === selectedEvent.id
              ? { ...updatedEvent, id: selectedEvent.id, start: startDate, end: endDate }
              : event
          );
          setEvents(updatedEvents);
  
          // Enviar atualização ao backend
          const response = await fetch(`http://localhost:5000/events/${selectedEvent.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, start: startDate.toISOString(), end: endDate.toISOString() }),
          });
  
          if (!response.ok) {
            throw new Error('Erro ao atualizar evento');
          }
  
          const updatedEventFromServer = await response.json();
          setSelectedEvent(null);
        } else {
          // Criar novo evento
          const newEventWithId: Event = { id: events.length + 1, title, start: startDate, end: endDate };
          setEvents([...events, newEventWithId]);
  
          // Enviar novo evento ao backend
          const response = await fetch('http://localhost:5000/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, start: startDate.toISOString(), end: endDate.toISOString() }),
          });
  
          if (!response.ok) {
            throw new Error('Erro ao criar evento');
          }
  
          const createdEventFromServer = await response.json();

        }
  
        setShowEditModal(false);
        setShowCreateModal(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Formato de data inválido');
    }
  };

  const openCreateModal = () => {
    setNewEvent({ title: '', start: '', end: '' });
    setShowCreateModal(true);
  };

  const removeEvent = async (eventId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/events/${eventId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Erro ao deletar evento');
      }
  
      // Remover o evento localmente após a exclusão no backend
      setEvents(events.filter(event => event.id !== eventId));
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  

  const selectEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleShowMore = (eventsToShow: Event[]) => {
    setShowMoreEvents(eventsToShow);
    setIsPopupOpen(true);
  };
  useEffect(()=>{
    fetchUsers();
  },[])

  return (
    <div>
      <div className="mb-4">
        <h2>Adicionar Horário</h2>
        <button onClick={openCreateModal} className="bg-green-500 text-white px-4 py-2 rounded duration-200 hover:bg-gray-400">
          Criar Evento
        </button>
        <EventPopup
        isOpen={isPopupOpen}
        events={showMoreEvents}
        onClose={() => setIsPopupOpen(false)}
        onSelectEvent={(event) => {
          selectEvent(event);
          setIsPopupOpen(false);
        }}
      />

        {/* Modal de edição de eventos */}
        <EventModal
          isOpen={showEditModal}
          event={selectedEvent}
          onClose={() => setShowEditModal(false)}
          onSave={addOrUpdateEvent}
          onDelete={()=>{
            if(selectedEvent){
              removeEvent(selectedEvent.id)
            }
          }}
        />

        {/* Modal de criação de eventos */}
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={addOrUpdateEvent}
        />
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={selectEvent}
        onShowMore={(events, date) => handleShowMore(events)} // Lidando com "more"
      />

    </div>
  );
};

export default CalendarStructure;
