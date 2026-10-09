import { useState, useEffect } from 'react';
import { Header } from "../../components/Header";

export function EventsPage() {
  const [loading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        setIsLoading(true);

        const res = await fetch('http://localhost:5000/api/events');

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setEvents(data);
        console.log('Fetched events:', data);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventDetails();
  }, []);

  if (loading) return <div>Loading Events...</div>
  if (error) return <div>Failed to load events: {error}</div>

  return (
    <>
      <Header />

      <div>
        
      </div>
    </>
  )
}