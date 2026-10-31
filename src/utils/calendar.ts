import { WeddingDetails } from '../types/wedding';

export function generateGoogleCalendarUrl(wedding: WeddingDetails): string {
  // Event starts at 4:00 PM (16:00) on wedding date (e.g., 2027-04-23)
  const cleanDate = (wedding.weddingDate || '2027-04-23').replace(/-/g, '');
  const startTime = `${cleanDate}T080000Z`; // 4:00 PM PHT is 08:00 UTC
  const endTime = `${cleanDate}T150000Z`;   // 11:00 PM PHT is 15:00 UTC

  const title = encodeURIComponent(`${wedding.groomName} & ${wedding.brideName}'s Wedding`);
  const details = encodeURIComponent(
    `We can't wait to celebrate our special day with you!\n\nCeremony & Reception at ${wedding.venueName}, ${wedding.locationCity}.\nAddress: ${wedding.venueAddress}\nRSVP & Info: ${wedding.contactEmail}`
  );
  const location = encodeURIComponent(`${wedding.venueName}, ${wedding.venueAddress}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
}

export function downloadIcsFile(wedding: WeddingDetails): void {
  const title = `${wedding.groomName} & ${wedding.brideName}'s Wedding`;
  const description = `We can't wait to celebrate our special day with you! Ceremony & Reception at ${wedding.venueName}, ${wedding.locationCity}. Address: ${wedding.venueAddress}.`;
  const location = `${wedding.venueName}, ${wedding.venueAddress}`;
  const cleanDate = (wedding.weddingDate || '2027-04-23').replace(/-/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Raynold and Kath Wedding//Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${wedding.groomName.toLowerCase()}-${wedding.brideName.toLowerCase()}-2027@invitation`,
    'DTSTAMP:20261026T000000Z',
    `DTSTART:${cleanDate}T080000Z`,
    `DTEND:${cleanDate}T150000Z`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${wedding.groomName.toLowerCase()}-${wedding.brideName.toLowerCase()}-wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
