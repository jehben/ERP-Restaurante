import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getFinancialWeeks(startDateStr: string, endDateStr: string) {
  if (!startDateStr || !endDateStr) return [];
  
  const start = parseDate(startDateStr);
  const end = parseDate(endDateStr);
  
  const firstDay = new Date(start);
  const dayOfWeek = firstDay.getDay(); 
  
  const diffToWed = (dayOfWeek >= 3) ? (dayOfWeek - 3) : (dayOfWeek + 4);
  firstDay.setDate(firstDay.getDate() - diffToWed);
  
  const weeks = [];
  let currentStart = new Date(firstDay);
  let weekNum = 1;
  
  while (currentStart <= end) {
    const currentEnd = new Date(currentStart);
    currentEnd.setDate(currentStart.getDate() + 6);
    
    weeks.push({
      label: `Semana ${weekNum} (${currentStart.getDate().toString().padStart(2, '0')}/${(currentStart.getMonth() + 1).toString().padStart(2, '0')} a ${currentEnd.getDate().toString().padStart(2, '0')}/${(currentEnd.getMonth() + 1).toString().padStart(2, '0')})`,
      start: new Date(currentStart),
      end: new Date(currentEnd),
      value: 0,
      percent: 0,
    });
    
    currentStart.setDate(currentStart.getDate() + 7);
    weekNum++;
  }
  
  return weeks;
}
