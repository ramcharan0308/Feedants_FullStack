export const formatCurrency = (amount: number): string => {
  return `₹ ${amount.toLocaleString('en-IN')}`;
};

export const formatDateFull = (dateInput: string | Date): { dateStr: string; timeStr: string } => {
  if (!dateInput) return { dateStr: '--', timeStr: '--' };

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return { dateStr: '--', timeStr: '--' };

  const day = d.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const yearShort = d.getFullYear().toString().slice(-2);

  const dateStr = `${day} ${month} ${yearShort}`;

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hoursStr = hours.toString().padStart(2, '0');

  const timeStr = `${hoursStr}:${minutes} ${ampm}`;

  return { dateStr, timeStr };
};

export const formatCountdownSeconds = (totalSeconds: number): { days: string; hours: string; mins: string; secs: string } => {
  if (totalSeconds <= 0) {
    return { days: '00d', hours: '00h', mins: '00m', secs: '00s' };
  }

  const d = Math.floor(totalSeconds / (3600 * 24));
  const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const days = `${d.toString().padStart(2, '0')}d`;
  const hours = `${h.toString().padStart(2, '0')}h`;
  const mins = `${m.toString().padStart(2, '0')}m`;
  const secs = `${s.toString().padStart(2, '0')}s`;

  return { days, hours, mins, secs };
};
