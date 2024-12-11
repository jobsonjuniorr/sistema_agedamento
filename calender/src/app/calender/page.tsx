'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventModal from '@/components/popup';
import CreateEventModal from '@/components/create-event-modal';
import EventPopup from '@/components/schedules';
import  {Button}  from '@/components/ui/button';
import { useTheme } from '@/theremcontext';
import ThemeToggleButton from '@/components/ui/buttondark';
import { Link } from 'react-router-dom';
import ErrorNotification from '@/components/erronotification';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0, locale: ptBR }),
  getDay,
  locales,
});

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  name: string; 
  value: string
}

const CalendarStructure: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [showMoreEvents, setShowMoreEvents] = useState<Event[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    //remove caso erros 
    if(!token){
      console.error("Token não encontrado, o usuário precisa fazer login novamente.");
       return;
    }
    try {
      const response = await fetch('http://localhost:5000/events', {
        headers: {
          'Authorization': `Bearer ${token}`, // Enviar o token no cabeçalho
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          alert('Sessão expirada ou token inválido. Faça login novamente.');
        } else {
          throw new Error('Erro ao buscar dados');
        }
      }
      const data = await response.json();


      const formattedEvents = data.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      setError("Erro na comunicação com o servidor.")
    }
  };

  const addOrUpdateEvent = async (updatedEvent: { title: string; start: string; end: string; name: string; value: string }) => {
    const { title, start, end, name, value } = updatedEvent;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const token = localStorage.getItem('token');
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


          const response = await fetch(`http://localhost:5000/events/${selectedEvent.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title, start: startDate.toISOString(), end: endDate.toISOString(), name, value }),
          });

          if (!response.ok) {
            throw new Error('Erro ao atualizar evento');
          }

          const updatedEventFromServer = await response.json();
          setSelectedEvent(null);
        } else {

          const newEventWithId: Event = { id: events.length + 1, title, start: startDate, end: endDate, name, value };
          setEvents([...events, newEventWithId]);


          const response = await fetch('http://localhost:5000/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title, start: startDate.toISOString(), end: endDate.toISOString(), name, value }),
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
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Erro ao deletar evento');
      }

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

  useEffect(() => {
    fetchEvents();
    document.body.className = isDarkMode ? 'dark-mode' : '';
  }, [isDarkMode]);

  return (
    <div className='w-full h-screen duration-300'>
    
      {/* Modal de criação de eventos */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={addOrUpdateEvent}
        isDarkMode={isDarkMode} 
      />
      <EventPopup
        isOpen={isPopupOpen}
        events={showMoreEvents}
        onClose={() => setIsPopupOpen(false)}
        isDarkMode={isDarkMode}
        onSelectEvent={(event) => {
          selectEvent(event);
          setIsPopupOpen(false);
        } } />


      {/* Modal de edição de eventos */}
      <EventModal
        isOpen={showEditModal}
        event={selectedEvent}
        onClose={() => setShowEditModal(false)}
        onSave={addOrUpdateEvent}
        isDarkMode={isDarkMode} 
        onDelete={() => {
          if (selectedEvent) {
            removeEvent(selectedEvent.id);
          }
        }}
      />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width:'100%'}}
        onSelectEvent={selectEvent}
        onShowMore={(events, date) => handleShowMore(events)} // Lidando com "more"
        className='.rbc-month-view '
        views={['month', 'agenda']}
        step={60}
        culture='pt-BR'
        defaultView="month"
        defaultDate={new Date()}
        components={{
          toolbar: (props) => (
            //grid grid-cols-1 p-4 gap-2 
            <div className='flex flex-col-reverse items-center  md:flex bg-card md:items-center'>
               <span className='text-base md:text-xl 2xl:text-3xl font-bold capitalize p-1 2xl:mt-2 2xl:mb-2'>{props.label}</span>
              <div className='flex flex-col gap-2 md:flex  md:gap-5 items-center p-1 mt-4 2xl:mt-5 md:mt-1 md:w-full xl:flex-row md:justify-around'>
             <div className='flex  gap-3'>
              <Button  onClick={() => props.onNavigate('PREV')}>Anterior</Button>
              <Button onClick={() => props.onNavigate('NEXT')}>Próximo</Button>
              <Button onClick={() => props.onNavigate('TODAY')}>Dia atual</Button>
             </div>
              <div className='flex  gap-3'>
              <Button onClick={openCreateModal}>Criar Evento </Button>
              <Button onClick={() => props.onView('month')}>Mês</Button>
              <Button onClick={() => props.onView('agenda')}>Agenda</Button>
              {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
              </div>
             <div className='flex  gap-3'>
              <ThemeToggleButton />
              <Button>
              <Link to={"/graphic"}>Gráficos</Link>
              </Button>        
             </div>
              </div>
             
            </div>
          ),}}
          messages={{
            showMore: (total) => `+${total} mais`,
            noEventsInRange : 'Não há nenhum evento agendado no momento.'
          }}
          eventPropGetter={(event) => {
            const isToday =
              new Date(event.start).toDateString() === new Date().toDateString();
          
            const baseClasses = 'rounded text-white shadow-sm transition-all';
            const todayClasses = 'bg-blue-500 .hover:bg-blue-700';
            const defaultClasses = 'bg-gray-400 .hover:bg-gray-600';
            const selectedClasses = ''; // Para eventos selecionados
          
            const appliedClasses = isToday
              ? `${todayClasses} ${selectedClasses}`
              : `${defaultClasses} ${selectedClasses}`;
          
            return {
              className: `${baseClasses} ${appliedClasses}`,
            };
          }}
          
      //.rbc-event .rbc-day-slot .rbc-toolbar .rbc-header .rbc-today .rbc-day-bg  .rbc-off-range-bg .rbc-button-link   .rbc-agenda-empty
      />
    </div>
  );
};

export default CalendarStructure;
